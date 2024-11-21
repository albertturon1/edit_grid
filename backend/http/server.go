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

type Server struct {
	server      *http.Server
	router      *mux.Router
	rooms       *RoomManager
	RoomService edit_grid.RoomService
}

func NewServer() *Server {
	s := &Server{
		server: &http.Server{},
		router: mux.NewRouter(),
		rooms:  NewRoomManager(),
	}

	s.router.Use(corsMiddleware)
	s.router.Use(LoggerMiddleware)

	s.server.Handler = http.HandlerFunc(s.serveHTTP)

	// Setup error handling routes.
	s.router.NotFoundHandler = http.HandlerFunc(s.handleNotFound)

	{
		r := s.router.PathPrefix("/").Subrouter()
		s.registerRoomRoutes(r)
	}

	return s
}

// LoggerMiddleware logs HTTP requests
func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create a response writer wrapper to capture the status code
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Process the request
		next.ServeHTTP(lrw, r)

		// Log the request details
		log.Printf(
			"%s %s %s %d %s",
			r.Method,
			r.RequestURI,
			r.RemoteAddr,
			lrw.statusCode,
			time.Since(start),
		)
	})
}

// loggingResponseWriter wraps the http.ResponseWriter to capture the status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

// WriteHeader captures the status code
func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
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
