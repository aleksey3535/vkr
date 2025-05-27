package dev

import (
	"log/slog"
	"net/http"
	"os"
	"queueAppV2/internal/config"
	"queueAppV2/internal/handler"
	"queueAppV2/internal/middleware"
	"queueAppV2/internal/repository"
	"queueAppV2/internal/repository/postgres"
	"queueAppV2/internal/repository/postgres/migrations"
	"time"

	"github.com/charmbracelet/log"
	"github.com/jmoiron/sqlx"
	"github.com/robfig/cron/v3"
)

type App struct {
	cfg *config.Config
	handler *handler.Handler
	db *sqlx.DB
}

func New() *App {
	cfg := config.MustLoad()
	log.Info(cfg)
	log := setupLogger(cfg)
	time.Sleep(10 * time.Second)
	db := postgres.MustCreate(cfg, log)
	migrations.ApplyMigrations(db)
	migrations.InitServices(db)
	migrations.InitTimeSlots(db)
	repository := repository.New(db)
	mw := middleware.New(log, cfg)
	h := handler.New(mw, log, repository, cfg)

	return &App{
		handler: h,
		cfg: cfg,
		db: db,
	}
}

func(a *App) Run() error {
	port := ":" + a.cfg.Port
	log.Info("Server starting at port" + port)
	go restartDb(a.db)
	return http.ListenAndServe(port, a.handler.InitRoutes())
}

func (a *App) Stop()  {
	migrations.CancelMigrations(a.db)
}

func restartDb(db *sqlx.DB) {
	c := cron.New()
	runTask := func() {
		queries := []string {
			"DELETE FROM Appointments",
			"ALTER SEQUENCE appointments_appointmentId_seq restart with 1",
			"DELETE FROM Users",
			"ALTER Sequence users_userid_seq restart with 1",
			"UPDATE TimeSlots SET IsBusy = false",
		}
		for _, query := range queries {
			db.MustExec(query)
		}
		log.Info("Database cleared")
	}
	if _, err := c.AddFunc("0 0 * * *", runTask); err != nil {
		panic(err)
	}
	log.Info("cron activated")
	c.Start()
	select {}
}

func setupLogger(cfg *config.Config) *slog.Logger {
	var log *slog.Logger
	switch cfg.Env {
	case "local":
		log = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		}))
	case "dev":
		log = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		}))
	}
	return log
}