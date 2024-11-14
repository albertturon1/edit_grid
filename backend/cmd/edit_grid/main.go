package main

import (
	"context"
	"fmt"
	"os"

	"github.com/albertturon1/edit_grid/http"
	"github.com/albertturon1/edit_grid/sqlite"
)

func main() {
	port := "8080"
	dbConnenction := "sqlite/rooms.db"

	ctx, cancel := context.WithCancel(context.Background())
	c := make(chan os.Signal, 1)
	go func() { <-c; cancel() }()

	m := NewMain(dbConnenction)

	// Execute program.
	if err := m.Run(port); err != nil {
		m.Close()
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	// Wait for CTRL-C.
	<-ctx.Done()

	// Clean up program
	// Clean up program.
	if err := m.Close(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// Main represents the program.
type Main struct {
	HTTPServer *http.Server
	DB         *sqlite.DB
}

// NewMain returns a new instance of Main.
func NewMain(dbConnenction string) *Main {
	return &Main{
		HTTPServer: http.NewServer(),
		DB:         sqlite.NewDB(dbConnenction),
	}
}

func (m *Main) Close() error {
	if m.HTTPServer != nil {
		if err := m.HTTPServer.Close(); err != nil {
			return err
		}
	}

	if m.DB != nil {
		if err := m.DB.Close(); err != nil {
			return err
		}
	}

	return nil
}

func (m *Main) Run(port string) error {
	roomService := sqlite.NewRoomService(m.DB)

	m.HTTPServer.RoomService = roomService

	if err := m.HTTPServer.Open(port); err != nil {
		return err
	}

	if err := m.DB.Open(); err != nil {
		return fmt.Errorf("cannot open db: %w", err)
	}

	return nil
}
