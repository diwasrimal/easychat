package middleware

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/diwasrimal/easychat/backend/jwt"
	"github.com/diwasrimal/easychat/backend/types"
	"github.com/diwasrimal/easychat/backend/utils"
)

// Performs a JWT authentication and saves the requesting
// user id in request's context
func UseAuth(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.Header.Get("Authorization"), " ")
		if len(parts) != 2 {
			utils.SendJsonResp(w, http.StatusUnauthorized, types.Json{
				"message": "Missing or invalid 'Authorization' header",
			})
			return
		}
		token := parts[1]

		// Ensure that token has valid signature and is not expired
		validSignature, jwtPayload := jwt.VerifyAndDecode(token)
		if !validSignature {
			utils.SendJsonResp(w, http.StatusUnauthorized, types.Json{"message": "Invalid token"})
			return
		}
		expTime := int64(jwtPayload["exp"].(float64))
		if time.Now().Unix() > expTime {
			utils.SendJsonResp(w, http.StatusUnauthorized, types.Json{"message": "Token has expired"})
			return
		}

		userId := uint64(jwtPayload["userId"].(float64))
		ctx := context.WithValue(r.Context(), "userId", userId)

		next.ServeHTTP(w, r.WithContext(ctx))
	}
	return http.HandlerFunc(fn)
}
