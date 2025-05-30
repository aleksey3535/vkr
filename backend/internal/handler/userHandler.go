package handler

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"queueAppV2/internal/models"
	"queueAppV2/internal/repository"
	"queueAppV2/internal/repository/postgres/migrations"
	"time"

	"github.com/gorilla/mux"
)

type UserRepositoryI interface {
	GetFreeSlots(serviceID int) ([]models.Slot, error)
	RegisterNewUser(slotID int, user models.User) (models.Appointment, error)
	UpdateTimeSlot(timeSlotID int) error
}


type UserHandler struct {
	log *slog.Logger
	repo   UserRepositoryI
}

func NewUserHandler(log *slog.Logger, repo UserRepositoryI) *UserHandler {
	return &UserHandler{
		log: log,
		repo: repo,
	}
}

type DataForSlots struct {
	Data []models.Slot
}

func (uh *UserHandler) FreeSlotsHandler(w http.ResponseWriter, r *http.Request) {
	const op = "handler.userHandler.freeSlotsHandler"
	log := uh.log.With("op", op)

	nowWithoutLoc := time.Now()

	loc, err := time.LoadLocation("Europe/Moscow")
	if err != nil {
		log.Error("error loading location: " + err.Error())
	}
	now := nowWithoutLoc.In(loc)
	targetTimes := migrations.InitCheckDate(now)
	for targetTime, timeSlotIdList := range targetTimes {
		if now.After(targetTime) {
			for _, timeSlotID := range timeSlotIdList {
				if err := uh.repo.UpdateTimeSlot(timeSlotID); err != nil {
					log.Error("occurred with uh.repo.UpdateTimeSlot " + err.Error())
				}
			}
		}
	}

	idStr := mux.Vars(r)["id"]
	id, errorMessage, ok := validateServiceID(idStr)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(errorMessage)
		return
	}
	slots, err := uh.repo.GetFreeSlots(id)
	if err != nil {
		if errors.Is(err, repository.ErrServiceNotFound) {
			message := ErrorWrapper(err)
			w.WriteHeader(http.StatusNotFound)
			w.Write(message)
			return
		}
		InternalErrorHandler(w)
		log.Error("occurred with uh.repo.GetFreeSlots " + err.Error())
		return
	}
	data := DataForSlots{Data: slots}
	message, err := json.Marshal(data)
	if err != nil {
		log.Error("occurred while marshalling slots slice" + err.Error())
		InternalErrorHandler(w)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(message)
	
}


func (uh *UserHandler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	const op = "handler.userHandler.registerHandler"
	log := uh.log.With("op", op)
	
	slotIdStr := mux.Vars(r)["id"]
	slotId, errorMessage, ok := validateSlotID(slotIdStr)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(errorMessage)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Error("occurred with reading body " + err.Error())
		InternalErrorHandler(w)
		return
	}
	var user models.User
	if err = json.Unmarshal(body, &user); err != nil {
		InvalidDataHandler(w)
		return
	}
	if message, ok := validatePassportNumber(user.PassportNumber); !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(message)
		return
	}
	queue, err := uh.repo.RegisterNewUser(slotId, user)
	if err != nil {
		if errors.Is(err, repository.ErrBusySlot) || errors.Is(err, repository.ErrAlreadyRegistered) || errors.Is(err, repository.ErrServiceNotFound) {
			message := ErrorWrapper(err)
			w.WriteHeader(http.StatusBadRequest)
			w.Write(message)
			return
		}
		log.Error("occurred with uh.repo.RegisterNewUser " + err.Error())
		InternalErrorHandler(w)
		return
	}
	message, err := json.Marshal(queue)
	if err != nil {
		log.Error("occurred with marshalling json " + err.Error())
		InternalErrorHandler(w)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(message)
}
