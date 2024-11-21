FROM golang:1.23-alpine

# Install GCC for CGO support
RUN apk add --no-cache gcc musl-dev

# Set environment variables for CGO and Go modules
ENV CGO_ENABLED=1 GO111MODULE=on

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY .air.toml .air.toml

EXPOSE 8080



CMD ["air", "-c", ".air.toml"]
