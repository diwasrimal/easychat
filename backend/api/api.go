package api

import (
	"net/http"

	"github.com/diwasrimal/easychat/backend/types"
	"github.com/diwasrimal/easychat/backend/utils"
)

type Response struct {
	Code    int
	Payload types.Json
}

func MakeHandler(f func(http.ResponseWriter, *http.Request) Response) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		resp := f(w, r)
		utils.SendJsonResp(w, resp.Code, resp.Payload)
	}
	return http.HandlerFunc(fn)
}
