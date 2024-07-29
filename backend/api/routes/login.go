package routes

import (
	"log"
	"net/http"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/jwt"
	"github.com/diwasrimal/easychat/backend/types"
	"github.com/diwasrimal/easychat/backend/utils"

	"golang.org/x/crypto/bcrypt"
)

func LoginPost(w http.ResponseWriter, r *http.Request) api.Response {
	body, err := utils.ParseJson(r.Body)
	log.Printf("Hit LoginPost() with body: %v\n", body)
	if err != nil {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Couldn't parse request body as json"},
		}
	}

	// Ensure both email and password are given
	email, emailOk := body["email"].(string)
	password, passwordOk := body["password"].(string)
	if !emailOk || !passwordOk || len(email) == 0 || len(password) == 0 {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Missing login data"},
		}
	}

	// Retreive user details using email and check password
	user, err := db.GetUserByEmail(email)
	if err != nil {
		log.Printf("Error getting user details from db: %v\n", err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{"message": "Error logging in"},
		}
	}
	if user == nil {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "No such email is registered"},
		}
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return api.Response{
			Code:    http.StatusUnauthorized,
			Payload: types.Json{"message": "Incorrect password"},
		}
	}

	// Create and send a JWT token containing user's id
	token := jwt.Create(types.Json{"userId": user.Id})
	return api.Response{
		Code:    http.StatusOK,
		Payload: types.Json{"jwt": token, "userId": user.Id},
	}
}
