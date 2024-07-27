package middleware

import (
	"context"
	"net/http"
	"strings"

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
		valid, jwtPayload := jwt.VerifyAndDecode(token)
		if !valid {
			utils.SendJsonResp(w, http.StatusUnauthorized, types.Json{"message": "Invalid token"})
			return
		}
		userId := uint64(jwtPayload["userId"].(float64))
		ctx := context.WithValue(r.Context(), "userId", userId)

		next.ServeHTTP(w, r.WithContext(ctx))
	}
	return http.HandlerFunc(fn)
}
