package http

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type RoomClient struct {
	Conn *websocket.Conn // WebSocket connection
	Room *Room           // Room reference for client
	Send chan []byte     // Channel for sending data to the client
}

type Room struct {
	ID         string               // Unique identifier for the room
	Clients    map[*RoomClient]bool // Active clients connected to this room
	Headers    []string             // CSV headers
	Rows       [][]string           // Table data as rows
	Broadcast  chan []byte          // Channel to broadcast messages to all clients
	Register   chan *RoomClient     // Channel to register new clients
	Unregister chan *RoomClient     // Channel to unregister disconnected clients
	Mutex      sync.Mutex           // Mutex to handle concurrent access
}

type RoomManager struct {
	Rooms map[string]*Room // Map of room ID to Room
	Mutex sync.Mutex       // Mutex for thread-safe access
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*Room),
	}
}

func NewRoom(id string, headers []string, rows [][]string) *Room {
	room := &Room{
		ID:         id,
		Clients:    make(map[*RoomClient]bool),
		Headers:    headers,
		Rows:       rows,
		Broadcast:  make(chan []byte),
		Register:   make(chan *RoomClient),
		Unregister: make(chan *RoomClient),
	}

	return room
}

func NewRoomClient(conn *websocket.Conn, room *Room) *RoomClient {
	return &RoomClient{
		Conn: conn,
		Room: room,
		Send: make(chan []byte),
	}
}

func (room *Room) ServerWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade to websocket", http.StatusInternalServerError)
	}

	roomClient := NewRoomClient(conn, room)

	room.Register <- roomClient

	go roomClient.ReadPump()
	go roomClient.WritePump()
}

func (r *Room) Run() {
	for {
		select {
		case client := <-r.Register:
			r.Mutex.Lock()
			r.Clients[client] = true
			r.Mutex.Unlock()
			log.Printf("Client registered in room %s. Total clients: %d\n", r.ID, len(r.Clients))

		case client := <-r.Unregister:
			r.Mutex.Lock()
			if _, ok := r.Clients[client]; ok {
				delete(r.Clients, client)
				close(client.Send)
				log.Printf("Client unregistered from room %s. Remaining clients: %d\n", r.ID, len(r.Clients))
			}
			r.Mutex.Unlock()

		case message := <-r.Broadcast:
			r.Mutex.Lock()
			log.Printf("Broadcasting message to room %s. Clients to notify: %d\n", r.ID, len(r.Clients))

			for client := range r.Clients {
				select {
				case client.Send <- message:
					log.Printf("Message sent to client in room %s\n", r.ID)
				default:
					delete(r.Clients, client)
					close(client.Send)
					log.Printf("Client in room %s removed due to failure to send message\n", r.ID)
				}
			}
			r.Mutex.Unlock()
		}
	}
}

func (room *Room) ServeWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v\n", err)
		return
	}

	client := NewRoomClient(conn, room)
	room.Register <- client

	// Log the connection
	log.Printf("Client connected to room %s. Total clients: %d\n", room.ID, len(room.Clients))

	go client.ReadPump()
	go client.WritePump()

	// Handle disconnection
	defer func() {
		room.RemoveClient(client)
		log.Printf("Client disconnected from room %s. Remaining clients: %d\n", room.ID, len(room.Clients))
		conn.Close()
	}()
}

// ReadPump reads messages from the WebSocket and applies any changes to the room
func (rc *RoomClient) ReadPump() {
	defer func() {
		rc.Room.Unregister <- rc
		rc.Conn.Close()
	}()

	for {
		_, message, err := rc.Conn.ReadMessage()
		if err != nil {
			break
		}

		rc.Room.Broadcast <- message
	}
}

// WritePump sends data from the Send channel to the client’s WebSocket.
func (c *RoomClient) WritePump() {
	defer c.Conn.Close()

	for message := range c.Send {
		if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			break
		}
	}
}

func (room *Room) BroadcastPatch(patch []byte) {
	room.Broadcast <- patch
}

func (rm *RoomManager) CreateRoom(headers []string, rows [][]string) *Room {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	id := generateUniqueRoomID(rm.Rooms)
	room := NewRoom(id, headers, rows)

	rm.Rooms[id] = room

	go room.Run()

	return room
}

func (rm *RoomManager) GetRoom(id string) (*Room, error) {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	room, exists := rm.Rooms[id]
	if exists == false {
		return nil, fmt.Errorf("Room not found")
	}

	return room, nil
}

func (rm *RoomManager) RemoveRoom(id string) {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	delete(rm.Rooms, id)
}

func (rm *RoomManager) Register(id string) {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	delete(rm.Rooms, id)
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

func (room *Room) AddClient(client *RoomClient) {
	room.Register <- client
}

func (room *Room) RemoveClient(client *RoomClient) {
	room.Unregister <- client
}
