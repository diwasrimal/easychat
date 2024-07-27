package routes

import (
	"log"
	"net/http"
	"strings"

	"github.com/diwasrimal/easychat/backend/api"
	"github.com/diwasrimal/easychat/backend/db"
	"github.com/diwasrimal/easychat/backend/types"
	"github.com/diwasrimal/easychat/backend/utils"

	"golang.org/x/crypto/bcrypt"
)

func RegisterPost(w http.ResponseWriter, r *http.Request) api.Response {
	body, err := utils.ParseJson(r.Body)
	log.Printf("Hit RegisterPost() with body: %v\n", body)
	if err != nil {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Couldn't parse request body as json"},
		}
	}

	// Ensure all data is provided and is in valid format
	fullname, fullnameOk := body["fullname"].(string)
	email, emailOk := body["email"].(string)
	password, passwordOk := body["password"].(string)
	if !fullnameOk || !passwordOk || !emailOk || !utils.IsValidEmail(email) {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Missing/invalid data"},
		}
	}
	fullname = strings.Trim(fullname, " \t\n\r")
	if len(fullname) == 0 || len(password) == 0 {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Data should not be empty"},
		}
	}

	// Hash password with bcrypt
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return api.Response{
			Code:    http.StatusBadRequest,
			Payload: types.Json{"message": "Password should be max 72 chars."},
		}
	}
	passwordHash := string(hashed)

	// Check if user with email exists
	// TODO: from here
	taken, err := db.IsEmailRegistered(email)
	if err != nil {
		log.Printf("Error checking email's existence: %v\n", err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{"message": "Error registering user"},
		}
	}
	if taken {
		return api.Response{
			Code:    http.StatusConflict,
			Payload: types.Json{"message": "User with email already exists"},
		}
	}

	err = db.CreateUser(fullname, email, passwordHash)
	if err == nil {
		log.Println("Registered user!")
		return api.Response{
			Code:    http.StatusCreated,
			Payload: types.Json{},
		}
	} else {
		log.Printf("Error creating user in db: %v\n", err)
		return api.Response{
			Code:    http.StatusInternalServerError,
			Payload: types.Json{"message": "Error registering user"},
		}
	}
}
