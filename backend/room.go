package edit_grid

import (
	"context"
	"time"
)

type CreateRoom struct {
	Rows     [][]string `json:"rows"`
	Headers  []string   `json:"headers"`
	FileName string     `json:"filename"`
}

type Room struct {
	ID        int       `db:"id" json:"id"`
	FileHash  string    `db:"file_hash" json:"file_hash"`
	FileName  string    `db:"file_name" json:"file_name"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type RoomService interface {
	GetRoomById(ctx context.Context, id int) (*Room, error)
	CreateRoom(ctx context.Context, table *CreateRoom) error
	// GetRooms(ctx context.Context, id int) ([]*Room, error)
	// UpdateRoom(ctx context.Context, id int, table *Table) (*Room, error)
}
