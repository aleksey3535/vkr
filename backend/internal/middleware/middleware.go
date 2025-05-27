package middleware

import (
	"log/slog"
	"net/http"
	"queueAppV2/internal/config"

	"github.com/dgrijalva/jwt-go"
)

type MiddleWare struct {
	log *slog.Logger
	cfg *config.Config
}

func New(log *slog.Logger, cfg *config.Config) *MiddleWare {
	return &MiddleWare{log: log, cfg: cfg}
}

func (mw *MiddleWare) UseHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")
		next.ServeHTTP(w, r)
	})
}

func (mw *MiddleWare) CheckAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		const op = "middleware.CheckAuth"
		log := mw.log.With("op", op)
		tokenString := r.Header.Get("Token")
		if tokenString == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		token, err := jwt.ParseWithClaims(tokenString, jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return mw.cfg.Salt, nil
		})
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			log.Error("with parse token " + err.Error())
			return
		}
		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
