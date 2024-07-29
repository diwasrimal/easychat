package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/api/routes"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/jwt"
	mw "github.com/diwasrimal/easychat/backend/middleware"
	"github.com/diwasrimal/easychat/backend/utils"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	var (
		dbfile    = utils.MustGetEnv("DB_FILE")
		port      = utils.MustGetEnv("SERVER_PORT")
		jwtSecret = utils.MustGetEnv("JWT_SECRET")
	)

	jwt.Init(jwtSecret)
	db.MustInit("easychat.db")
	defer db.Close()

	handlers := map[string]http.Handler{
		"POST /api/login":    mw.UseJson(api.MakeHandler(routes.LoginPost)),
		"POST /api/register": mw.UseJson(api.MakeHandler(routes.RegisterPost)),

		"GET /api/auth":              mw.UseAuth(api.MakeHandler(routes.AuthGet)),
		"GET /api/users/{id}":        mw.UseAuth(mw.UseJson(api.MakeHandler(routes.UsersGet))),
		"GET /api/chat-partners":     mw.UseAuth(mw.UseJson(api.MakeHandler(routes.ChatPartnersGet))),
		"GET /api/search":            mw.UseAuth(mw.UseJson(api.MakeHandler(routes.SearchGet))),
		"GET /api/messages/{pairId}": mw.UseAuth(mw.UseJson(api.MakeHandler(routes.MessagesGet))),
		"GET /ws":                    mw.UseWebsocketAuth(http.HandlerFunc(routes.WSHandleFunc)),
		"GET /api/tmp":               mw.UseJson(api.MakeHandler(routes.TmpGet)),
	}

	mux := http.NewServeMux()
	for route, handler := range handlers {
		mux.Handle(route, handler)
	}

	distDir := "./dist"
	fileServer := http.FileServer(http.Dir(distDir))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(distDir, r.URL.Path)
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}
		fileServer.ServeHTTP(w, r)
	})

	addr := "0.0.0.0:" + port
	log.Printf("Using sqlite3 database: %v\n", dbfile)
	log.Printf("Using jwt secret: %v\n", jwtSecret)
	log.Printf("Listening on %v...\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
