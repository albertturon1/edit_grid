package http

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/albertturon1/edit_grid"
)

type Client struct {
	URL string
}

func (c *Client) newRequest(_ctx context.Context, method, url string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, c.URL+url, body)
	if err != nil {
		return nil, err
	}

	// Default to JSON format.
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-type", "application/json")

	return req, nil
}

// SessionCookieName is the name of the cookie used to store the session.
const SessionCookieName = "session"

// Session represents session data stored in a secure cookie.
type Session struct {
	UserID      int    `json:"userID"`
	RedirectURL string `json:"redirectURL"`
	State       string `json:"state"`
}

type ErrorResponse struct {
	Success bool `json:"success"`
	// Code    int    `json:"code"`
	Error string `json:"error"`
}

// Error prints & optionally logs an error message.
func Error(w http.ResponseWriter, r *http.Request, err error) {
	// Extract error code & message.
	code, message := edit_grid.ErrorCode(err), edit_grid.ErrorMessage(err)

	// Log & report internal errors.
	if code == edit_grid.EINTERNAL {
		edit_grid.ReportError(r.Context(), err, r)
		LogError(r, err)
	}

	// Print user message to response based on reqeust accept header.
	switch r.Header.Get("Accept") {
	case "application/json":
	default:
		errorResponse := &ErrorResponse{Error: message, Success: false}
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(ErrorStatusCode(code))
		EncodeResponse(w, errorResponse)
	}
}

// parseResponseError parses an JSON-formatted error response.
func parseResponseError(resp *http.Response) error {
	defer resp.Body.Close()

	// Read the response body so we can reuse it for the error message if it
	// fails to decode as JSON.
	buf, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// Parse JSON formatted error response.
	// If not JSON, use the response body as the error message.
	var errorResponse ErrorResponse
	if err := json.Unmarshal(buf, &errorResponse); err != nil {
		message := strings.TrimSpace(string(buf))
		if message == "" {
			message = "Empty response from server."
		}
		return edit_grid.Errorf(FromErrorStatusCode(resp.StatusCode), message)
	}

	return edit_grid.Errorf(FromErrorStatusCode(resp.StatusCode), errorResponse.Error)
}

// LogError logs an error with the HTTP route information.
func LogError(r *http.Request, err error) {
	log.Printf("[http] error: %s %s: %s", r.Method, r.URL.Path, err)
}

// lookup of application error codes to HTTP status codes.
var codes = map[string]int{
	edit_grid.ECONFLICT:       http.StatusConflict,
	edit_grid.EINVALID:        http.StatusBadRequest,
	edit_grid.ENOTFOUND:       http.StatusNotFound,
	edit_grid.ENOTIMPLEMENTED: http.StatusNotImplemented,
	edit_grid.EUNAUTHORIZED:   http.StatusUnauthorized,
	edit_grid.EINTERNAL:       http.StatusInternalServerError,
}

// ErrorStatusCode returns the associated HTTP status code for a edit_grid error code.
func ErrorStatusCode(code string) int {
	if v, ok := codes[code]; ok {
		return v
	}
	return http.StatusInternalServerError
}

// FromErrorStatusCode returns the associated edit_grid code for an HTTP status code.
func FromErrorStatusCode(code int) string {
	for k, v := range codes {
		if v == code {
			return k
		}
	}
	return edit_grid.EINTERNAL
}

// Success
type SuccessResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"` // Optional message
	Data    interface{} `json:"data,omitempty"`    // Optional data
}

func Success(w http.ResponseWriter, r *http.Request, message string, data any) {
	switch r.Header.Get("Accept") {
	case "application/json":
	default:
		successResponse := &SuccessResponse{
			Success: true,
		}

		// Set the message if it's provided
		if message != "" {
			successResponse.Message = message
		}

		// Set the data if it's provided
		if data != nil {
			successResponse.Data = data
		}

		// Set Content-Type and Status Code
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Encode the response as JSON
		EncodeResponse(w, successResponse)
	}
}

func EncodeResponse(w http.ResponseWriter, response any) {
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
	}
}
