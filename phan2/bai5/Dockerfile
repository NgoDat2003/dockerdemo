FROM golang:1.21 AS builder

WORKDIR /app

COPY . .

RUN go mod init go-docker
RUN go build -o main .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]