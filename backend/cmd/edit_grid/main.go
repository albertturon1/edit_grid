package main

import (
	"context"
	"fmt"
	"os"

	"github.com/albertturon1/edit_grid/http"
)

var (
	version string
	commit  string
)

// Main represents the program.
type Main struct {
	// HTTP server for handling HTTP communication.
	// SQLite services are attached to it before running.
	HTTPServer *http.Server
}

func main() {
	port := "4000"

	ctx, cancel := context.WithCancel(context.Background())
	c := make(chan os.Signal, 1)
	go func() { <-c; cancel() }()

	m := NewMain()

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

// NewMain returns a new instance of Main.
func NewMain() *Main {
	return &Main{
		HTTPServer: http.NewServer(),
	}
}

func (m *Main) Close() error {
	if m.HTTPServer != nil {
		if err := m.HTTPServer.Close(); err != nil {
			return err
		}
	}

	return nil
}

func (m *Main) Run(port string) error {
	if err := m.HTTPServer.Open(port); err != nil {
		return err
	}

	return nil
}
