package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/albertturon1/edit_grid"
	"github.com/gorilla/mux"
)

// ShutdownTimeout is the time given for outstanding requests to finish before shutdown.
const ShutdownTimeout = 1 * time.Second

type Router interface {
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

type Server struct {
	server      *http.Server
	router      *mux.Router
	RoomService edit_grid.RoomService
}

func NewServer() *Server {
	s := &Server{
		server: &http.Server{},
		router: mux.NewRouter(),
	}

	s.server.Handler = http.HandlerFunc(s.serveHTTP)

	// Setup error handling routes.
	s.router.NotFoundHandler = http.HandlerFunc(s.handleNotFound)

	{
		r := s.router.PathPrefix("/").Subrouter()
		s.registerRoomRoutes(r)
	}

	return s
}

func (s *Server) serveHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func (s *Server) handleNotFound(w http.ResponseWriter, r *http.Request) {
	// Set the status code to 404
	w.WriteHeader(http.StatusNotFound)

	// Write a simple message to the response body
	w.Write([]byte("404 - Not Found"))
}

func (s *Server) Close() error {
	ctx, cancel := context.WithTimeout(context.Background(), ShutdownTimeout)

	defer cancel()

	return s.server.Shutdown(ctx)
}

func (s *Server) Open(port string) error {
	// Check that the server and router are not nil
	if s.server == nil {
		return fmt.Errorf("server is not initialized")
	}
	if s.router == nil {
		return fmt.Errorf("router is not initialized")
	}

	// Set the server's address with the specified port
	s.server.Addr = ":" + port

	// Run the server in a goroutine, handling any errors
	go func() {
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			// Log the error or handle it according to your needs
			log.Printf("HTTP server ListenAndServe error: %v", err)
		}
	}()

	return nil
}
