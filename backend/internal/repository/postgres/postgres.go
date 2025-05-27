package postgres

import (
	"fmt"
	"log/slog"
	"queueAppV2/internal/config"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func MustCreate(cfg *config.Config, log *slog.Logger) *sqlx.DB {
	db, err := sqlx.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Db.Host, cfg.Db.Port, cfg.Db.Name, cfg.Db.Password, cfg.Db.Dbname, cfg.Db.Sslmode))
	if err != nil {
		panic(fmt.Sprint("error occurred creating database connection: " + err.Error()))
	}
	db = mustConnect(db, log)
	return db
}

func mustConnect(db *sqlx.DB, log *slog.Logger) *sqlx.DB {
	if err := db.Ping(); err != nil {
		log.Error("error occurred checking connection to database " + err.Error())
		time.Sleep(1 * time.Second)
		return mustConnect(db ,log)
	}
	return db
}





