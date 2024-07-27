package routes

import (
	"log"
	"net/http"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/types"
)

func FriendRequestorsGet(w http.ResponseWriter, r *http.Request) api.Response {
	userId := r.Context().Value("userId").(uint64)
	log.Printf("Hit FriendRequestorsGet() with userId: %v\n", userId)
	requestors, err := db.GetFriendRequestorsTo(userId)
	if err != nil {
		log.Printf("Error getting friends from db: %v\n", err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{},
		}
	}
	return api.Response{
		Code:    http.StatusOK,
		Payload: types.Json{"friendRequestors": requestors},
	}
}
