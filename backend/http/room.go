package http

import (
	"encoding/json"
	"net/http"

	"github.com/albertturon1/edit_grid"
	"github.com/gorilla/mux"
)

func (s *Server) registerRoomRoutes(r *mux.Router) {
	r.HandleFunc("/room", s.handlerCreateRoom).Methods("POST", "OPTIONS")
	r.HandleFunc("/room", s.handlerGetRoom).Methods("GET", "OPTIONS")
}

func (s *Server) handlerCreateRoom(w http.ResponseWriter, r *http.Request) {
	var roomBody edit_grid.CreateRoom

	if err := json.NewDecoder(r.Body).Decode(&roomBody); err != nil {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, "Invalid JSON body"))
		return
	}

	if roomBody.Rows == nil || roomBody.Headers == nil || roomBody.FileName == "" {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, "Failed schema validation"))
		return
	}

	room, err := s.RoomService.CreateRoom(r.Context(), &roomBody)
	if err != nil {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, err.Error()))
		return
	}

	Success(w, r, room)
}

func (s *Server) handlerGetRoom(w http.ResponseWriter, r *http.Request) {
	room, err := s.RoomService.GetRoomById(r.Context(), 1)
	if err != nil {
		Error(w, r, edit_grid.Errorf(edit_grid.EINVALID, err.Error()))
		return
	}

	Success(w, r, room)
}
