package repository

import (
	"database/sql"
	"errors"
	"queueAppV2/internal/models"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

type AdminRepository struct {
	db *sqlx.DB
}

func NewAdminRepository(db *sqlx.DB) *AdminRepository {
	return &AdminRepository{db : db}
}

func (ar *AdminRepository) GetAllAppointments() ([]models.AppointmentsForStatus, error) {
	result := make([]models.AppointmentsForStatus, 0)
	query := `SELECT a.AppointmentID, a.QueueNumber, u.FullName, t.StartTime, s.Cabinet FROM Appointments AS a 
	INNER JOIN Users AS u ON a.UserID = u.UserID
	INNER JOIN TimeSlots AS t ON a.TimeSlotID = t.TimeSlotID
	INNER JOIN Services AS s ON s.ServiceID = t.ServiceID 
	WHERE a.Status = $1
	ORDER BY t.StartTime ASC`
	rows, err := ar.db.Query(query, "waiting")
	if err != nil {
		return nil, errors.New("with db.Query " + err.Error())
	}
	for rows.Next() {
		var queue models.AppointmentsForStatus
		var startTime time.Time
		if err := rows.Scan(&queue.AppointmentID, &queue.QueueNumber, &queue.Surname, &startTime,&queue.Cabinet); err != nil {
			return nil, errors.New("with rows.Scan " + err.Error())
		}
		queue.Surname = strings.Split(queue.Surname, " ")[0]
		queue.StartTime = startTime.Format("15:04")
		result = append(result, queue)
	}
	if len(result) == 0 {
		return nil, ErrEmptyAppointments
	}
	return result, nil
}

func(ar *AdminRepository) GetAppointments(serviceID int) ([]models.AppointmentForAdmin, error) {
	result := make([]models.AppointmentForAdmin, 0)
	query := `SELECT a.AppointmentID, a.QueueNumber, u.FullName, u.PassportNumber, t.StartTime, a.Status FROM Appointments AS a 
		INNER JOIN Users AS u ON a.UserID = u.UserID
		INNER JOIN TimeSlots AS t ON a.TimeSlotID = t.TimeSlotID
		WHERE t.ServiceID = $1
		ORDER BY t.StartTime ASC`
	rows, err := ar.db.Query(query, serviceID)
	if err != nil {
		return nil, errors.New("with db.Query " + err.Error())
	}
	for rows.Next() {
		var queue models.AppointmentForAdmin
		var startTime time.Time
		if err := rows.Scan(&queue.AppointmentID, &queue.QueueNumber, &queue.FullName, 
			&queue.PassportNumber, &startTime, &queue.Status); err != nil {
				return nil, errors.New("with rows.Scan " + err.Error())
		}
		queue.StartTime = startTime.Format("15:04")
		result = append(result, queue)
	}
	if len(result) == 0{
		return nil, ErrEmptyAppointments
	}
	return result, nil
}

func(ar *AdminRepository) DeleteAppointment(queueID int) error {
	query := `UPDATE Appointments SET Status=$1 WHERE AppointmentID=$2`
	if _, err := ar.db.Exec(query, "done", queueID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrAppointmentNotFound
		}
		return errors.New("with db.Exec " + err.Error())
	}
	return nil
}

func(ar *AdminRepository) RestartDb() error {
	queries := []string {
		"DELETE FROM Appointments",
		"ALTER SEQUENCE appointments_appointmentId_seq restart with 1",
		"DELETE FROM Users",
		"ALTER Sequence users_userid_seq restart with 1",
		"UPDATE TimeSlots SET IsBusy = false",
	}
	for _, query := range queries {
		_, err := ar.db.DB.Exec(query)
		if err != nil {
			return errors.New("with db.Exec" + err.Error())
		}
	}
	return nil
}