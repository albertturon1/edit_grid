# Set Go module mode
export GO111MODULE=on

# Application name (binary)
APP=edit_grid
APP_EXECUTABLE="./out/$(APP)"

# Directories
CMD_DIR=./cmd/edit_grid

# Packages excluding vendor directory
ALL_PACKAGES=$(shell go list ./... | grep -v /vendor)

# Optional colors for terminal output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

## Quality
check-quality: ## Runs code quality checks
	make lint
	make fmt
	make vet

# Linting with golangci-lint
lint: ## Go linting
	golangci-lint run --enable-all

# Go vet for static analysis
vet: ## Go vet
	go vet ./...

# Go fmt for automatic formatting
fmt: ## Runs go formatter
	go fmt ./...

# Build the application binary
build: ## Build the app
	mkdir -p ./out
	go build -o $(APP_EXECUTABLE) $(CMD_DIR)

# Run the application
run: build ## Run the app after building
	$(APP_EXECUTABLE)

# Clean build artifacts
clean: ## Clean build artifacts
	rm -rf ./out

# Run in development mode with Docker
dev:
	docker build -t edit_grid-docker .
	docker run -p 8080:8080 --rm -v $(shell pwd):/app -v /app/tmp --name edit_grid-docker-air edit_grid-docker
