package edit_grid

type Table struct {
	Rows    [][]string `json:"rows"`
	Headers []string   `json:"headers"`
}

type RoomService interface {
	CreateNewRoom(table *Table)
}
