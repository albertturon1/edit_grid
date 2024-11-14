package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/albertturon1/edit_grid"
)

type RoomService struct {
	db *DB
}

func NewRoomService(db *DB) *RoomService {
	return &RoomService{db: db}
}

// func (s *RoomService) GetRoomById(ctx context.Context, id int) (*edit_grid.Room, error) {
func (s *RoomService) GetRoomById(ctx context.Context, id int) (*edit_grid.Room, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Execute query to read all values in order for a dial.
	row := tx.QueryRow(`
		SELECT *
		FROM room
		WHERE id = ?
	`, id)

	room := edit_grid.Room{}

	if err = row.Scan(&room.ID, &room.FileHash, &room.FileName, &room.CreatedAt, &room.UpdatedAt); err == sql.ErrNoRows {
		return &edit_grid.Room{}, fmt.Errorf("Failed to retrieve room")
	}

	return &room, nil
}

func (s *RoomService) CreateRoom(ctx context.Context, room *edit_grid.CreateRoom) (*edit_grid.Room, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	res, err := tx.db.db.Exec(`
    	INSERT INTO room (file_hash, file_name, created_at, updated_at)
     	VALUES (?, ?, ?, ?)`, "", &room.FileName, time.Now(), nil)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	// Retrieve the last inserted ID
	id, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	v, err := s.GetRoomById(ctx, int(id))
	if err := tx.Commit(); err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("Failed to commit changes")
	}

	return v, nil
}

func createRoom(ctx context.Context, tx *Tx, room *edit_grid.Room) (*edit_grid.Room, error) {
	return nil, nil
}
