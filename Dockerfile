FROM golang as builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY *.go ./
COPY k6-performance-test/ ./
RUN go install go.k6.io/xk6/cmd/xk6@latest
RUN xk6 build \
    --with github.com/eugercek/xk6-imap

RUN CGO_ENABLED=0 GOOS=linux go build -o load-test
CMD ./load-test
