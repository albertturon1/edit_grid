package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// RoomManager to manage multiple rooms
type RoomManager struct {
	Rooms map[string]*Room // Map of room ID to Room
	Mutex sync.Mutex       // Mutex for thread-safe access
}

// Room represents a room with clients
type Room struct {
	ID         string                 // Unique identifier for the room
	Clients    map[string]*RoomClient // Active clients connected to this room
	Headers    []string               // CSV headers
	Rows       [][]string             // Table data as rows
	Broadcast  chan []byte            // Channel to broadcast messages to all clients
	Register   chan *RoomClient       // Channel to register new clients
	Unregister chan *RoomClient       // Channel to unregister disconnected clients
	Mutex      sync.Mutex             // Mutex to handle concurrent access
}

// RoomClient represents a single WebSocket client in a room
type RoomClient struct {
	Conn   *websocket.Conn // WebSocket connection
	Room   *Room           // Room reference for the client
	Send   chan []byte     // Channel for sending data to the client
	UserID string          // Unique identifier for the user
}

// Create a new RoomManager
func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*Room),
	}
}

// Create a new Room
func NewRoom(id string, headers []string, rows [][]string) *Room {
	room := &Room{
		ID:         id,
		Clients:    make(map[string]*RoomClient),
		Headers:    headers,
		Rows:       rows,
		Broadcast:  make(chan []byte),
		Register:   make(chan *RoomClient),
		Unregister: make(chan *RoomClient),
	}
	go room.run() // Start the room event loop
	return room
}

// Create a new RoomClient
func NewRoomClient(conn *websocket.Conn, room *Room, userId string) *RoomClient {
	return &RoomClient{
		Conn:   conn,
		Room:   room,
		Send:   make(chan []byte),
		UserID: userId,
	}
}

// Run the room's event loop
func (room *Room) run() {
	for {
		select {
		case client := <-room.Register:
			room.Mutex.Lock()
			if _, exists := room.Clients[client.UserID]; exists {
				log.Printf("User %s is already connected to room %s", client.UserID, room.ID)
			} else {
				room.Clients[client.UserID] = client
				log.Printf("User %s connected to room %s", client.UserID, room.ID)
			}
			room.Mutex.Unlock()
		case client := <-room.Unregister:
			room.Mutex.Lock()
			if client, exists := room.Clients[client.UserID]; exists {
				delete(room.Clients, client.UserID)
				close(client.Send)
				log.Printf("User %s disconnected from room %s", client.UserID, room.ID)
			}
			room.Mutex.Unlock()
		case message := <-room.Broadcast:
			room.Mutex.Lock()
			for _, client := range room.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(room.Clients, client.UserID)
					log.Printf("Removed unresponsive user %s from room %s", client.UserID, room.ID)
				}
			}
			room.Mutex.Unlock()
		}
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request, roomManager *RoomManager) {
	// Upgrade the connection to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		http.Error(w, "Could not open WebSocket connection", http.StatusBadRequest)
		return
	}

	roomID := strings.TrimPrefix(r.URL.Path, "/room/")
	log.Printf("roomID: %s", roomID)
	if roomID == "" {
		log.Printf("Room not found: %s", roomID)
		return
	}

	userId := r.URL.Query().Get("user_id")
	log.Printf("userId: %s", userId)
	if userId == "" {
		log.Printf("userId not found: %s", roomID)
		return
	}

	// Find the room
	roomManager.Mutex.Lock()
	log.Printf("roomManager.Rooms: %v", roomManager.Rooms)
	room, exists := roomManager.Rooms[roomID]
	roomManager.Mutex.Unlock()

	if !exists {
		log.Printf("WebSocket upgrade error: %v", err)
		ws.Close()
		return
	}

	// Check if user already is part of select room
	roomManager.Mutex.Lock()
	_, ok := roomManager.Rooms[userId]
	log.Printf("userId: %s", userId)
	if ok {
		log.Printf("User is already a room member")
		return
	}
	roomManager.Mutex.Unlock()

	// Create a new RoomClient and register it
	client := NewRoomClient(ws, room, userId)

	room.Register <- client

	// Handle client connection
	// go client.readPump()
	// go client.writePump()
}

func logRoomManagerClients(roomManager *RoomManager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roomManager.Mutex.Lock()
		defer roomManager.Mutex.Unlock()

		roomsSummary := make(map[string][]string) // Map of roomID to client IDs

		for roomID, room := range roomManager.Rooms {
			room.Mutex.Lock()
			clientIDs := []string{}
			for client := range room.Clients {
				clientIDs = append(clientIDs, fmt.Sprintf("%p", client)) // Use pointer address as client ID
			}
			roomsSummary[roomID] = clientIDs
			room.Mutex.Unlock()
		}

		// Log the information
		for roomID, clientIDs := range roomsSummary {
			log.Printf("Room %s has clients: %v", roomID, clientIDs)
		}

		// Respond with the information
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(roomsSummary); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

func (client *RoomClient) readPump() {
	defer func() {
		client.Room.Unregister <- client
		client.Conn.Close()
	}()

	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message from user %s: %v", client.UserID, err)
			break
		}
		client.Room.Broadcast <- message
	}
}

func (client *RoomClient) writePump() {
	for message := range client.Send {
		err := client.Conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Printf("Error writing message to user %s: %v", client.UserID, err)
			break
		}
	}
}

// Handle incoming messages from a client
func handleClientMessages(client *RoomClient) {
	defer func() {
		client.Room.Unregister <- client
		client.Conn.Close()
	}()

	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		client.Room.Broadcast <- message
	}
}

// Send messages to the client
func sendClientMessages(client *RoomClient) {
	for message := range client.Send {
		err := client.Conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

func main() {
	// Initialize RoomManager
	roomManager := NewRoomManager()

	// Create a ServeMux
	router := http.NewServeMux()

	// Define routes
	router.HandleFunc("/create-room", createRoomHandler(roomManager))

	router.HandleFunc("GET /rooms", logRoomManagerClients(roomManager))

	router.HandleFunc("/room/{id}", func(w http.ResponseWriter, r *http.Request) {
		handleConnections(w, r, roomManager)
	})

	// Wrap the ServeMux with CORS middleware
	// wrappedMux := LoggerMiddleware(corsMiddleware(router))

	// Start the HTTP server
	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

// ResponseWriter wrapper to capture the status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

// LoggerMiddleware logs the details of each HTTP request
func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap the response writer
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

func (rm *RoomManager) CreateRoom(id string, headers []string, rows [][]string) *Room {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	// Check if room already exists
	if room, exists := rm.Rooms[id]; exists {
		return room
	}

	// Create a new room
	room := NewRoom(id, headers, rows)
	rm.Rooms[id] = room

	// Start the room's event loop
	go room.run()

	return room
}

func createRoomHandler(rm *RoomManager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse JSON payload
		var payload struct {
			Filename string     `json:"filename"`
			Headers  []string   `json:"headers"`
			Rows     [][]string `json:"rows"`
		}

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
			return
		}

		// Create the room
		id := generateUniqueRoomID(rm.Rooms)
		room := rm.CreateRoom(id, payload.Headers, payload.Rows)

		// Respond with success
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Room created successfully",
			"id":      room.ID,
		})
	}
}

func generateUniqueRoomID(rooms map[string]*Room) string {
	for {
		// Generate a new unique ID
		id := uuid.New().String()
		unique := true

		// Check if the generated ID already exists in the map
		for roomID := range rooms {
			if roomID == id {
				unique = false
				break
			}
		}

		// If the ID is unique, return it
		if unique {
			return id
		}
	}
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
