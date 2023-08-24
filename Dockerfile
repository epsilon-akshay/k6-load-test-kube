FROM golang as builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o load-test

FROM grafana/k6 as loadtest
WORKDIR /app
COPY k6-performance-test/ ./
COPY --from=builder /app .
RUN pwd
RUN ls /app
RUN ls
RUN cat /etc/os-release
USER root
RUN apk update
RUN apk upgrade
RUN apk add bash
#CMD ./load-test