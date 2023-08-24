FROM golang as builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY *.go ./
COPY k6-performance-test/ ./
RUN go install go.k6.io/xk6/cmd/xk6@latest
# Your extension's github url, I used mine as example
RUN xk6 build \
    --with github.com/eugercek/xk6-imap

RUN CGO_ENABLED=0 GOOS=linux go build -o load-test
CMD ./load-test
#
#FROM loadimpact/k6 as loadtest
#WORKDIR /app
#
#COPY --from=builder /app .
#RUN pwd
#RUN ls /app
#RUN ls
#RUN cat /etc/os-release
#USER root
#RUN apk update
#RUN apk upgrade
#RUN apk add bash
