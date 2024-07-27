package routes

import (
	"log"
	"net/http"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/types"
)

// Gives details of users with which the requesting user
// has chatted before. Sorted by most recent conversation
// date. Should be used which authentication
func ChatPartnersGet(w http.ResponseWriter, r *http.Request) api.Response {
	userId := r.Context().Value("userId").(uint64)
	log.Printf("Hit ChatPartnersGet() with userId: %v\n", userId)
	partners, err := db.GetRecentChatPartners(userId)
	if err != nil {
		log.Printf("Error getting recent chat partner details of %v: %v\n", userId, err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{"message": "Error retreiving partner details"},
		}
	}
	return api.Response{
		Code:    http.StatusOK,
		Payload: types.Json{"partners": partners},
	}
}
