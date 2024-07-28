package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/api/routes"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/jwt"
	mw "github.com/diwasrimal/easychat/backend/middleware"
	"github.com/diwasrimal/easychat/backend/utils"
	"github.com/rs/cors"
)

func main() {

	loadEnvFrom(".env")
	var (
		dburl     = utils.MustGetEnv("POSTGRES_URL")
		addr      = utils.MustGetEnv("SERVER_ADDR")
		jwtSecret = utils.MustGetEnv("JWT_SECRET")
		runMode   = utils.MustGetEnv("MODE")
	)

	jwt.Init(jwtSecret)
	db.MustInit(dburl)
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

	var finalHandler http.Handler

	switch runMode {
	case "dev":
		// Allow cross origin requests in dev mode
		finalHandler = cors.AllowAll().Handler(mux)
	case "prod":
		// Use a file server to serve frontend build files in production
		// also redirect all other routes to /index.html so that react handles it
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
		finalHandler = mux
	default:
		panic("Invalid enviroment variable value for 'MODE'")
	}

	log.Printf("Using db: %v\n", dburl)
	log.Printf("Using jwt secret: %v\n", jwtSecret)
	log.Printf("Listening on %v...\n", addr)
	log.Fatal(http.ListenAndServe(addr, finalHandler))
}

func loadEnvFrom(path string) {
	f, err := os.Open(path)
	if err != nil {
		if err == os.ErrNotExist {
			log.Printf("Env file: %v doesnot exist", path)
			return
		}
		log.Fatal(err)
	}
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		key, val, found := strings.Cut(sc.Text(), "=")
		if found {
			os.Setenv(key, val)
		}
	}
}
