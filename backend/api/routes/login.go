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
	log.Println("Checking password ", password, "against hash", user.PasswordHash)
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
		Payload: types.Json{"jwt": token},
	}
}

// // Should be used with auth middleware to work as expected.
// // This function assumes that authentication was handled by
// // middleware and hence just returns a ok status with logged in userid
// func LoginStatusGet(w http.ResponseWriter, r *http.Request) api.Response {
// 	userId := r.Context().Value("userId").(uint64)
// 	log.Printf("Login status valid for userId: %v\n", userId)
// 	return api.Response{
// 		Code:    http.StatusOK,
// 		Payload: types.Json{"userId": userId},
// 	}
// }
