package routes

import (
	"log"
	"net/http"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/types"
)

// Searches for a user by their fullname using likeness and some
// fuzziness
func SearchGet(w http.ResponseWriter, r *http.Request) api.Response {
	name := r.URL.Query().Get("name")
	log.Printf("Hit SearchGet() with name: %q\n", name)
	if len(name) == 0 {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Searched name cannot be empty"},
		}
	}
	results, err := db.SearchUser(name)
	if err != nil {
		log.Printf("Error getting user search results from db: %v\n", err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{},
		}
	}
	return api.Response{
		Code:    http.StatusOK,
		Payload: types.Json{"results": results},
	}
}
