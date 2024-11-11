package http

import (
	"encoding/json"
	"net/http"

	"github.com/albertturon1/edit_grid"
	"github.com/gorilla/mux"
)

func (s *Server) registerRoomRoutes(r *mux.Router) {
	r.HandleFunc("/new-room", s.handlerNewRoom).Methods("POST")

}

func (s *Server) handlerNewRoom(w http.ResponseWriter, r *http.Request) {
	var table edit_grid.Table

	if err := json.NewDecoder(r.Body).Decode(&table); err != nil {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, "Invalid JSON body"))
		return
	}

	if table.Rows == nil || table.Headers == nil {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, "Failed schema validation"))
		return
	}

	Success(w, r, "", table)
}
