FROM golang:1.20.0-alpine as builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY *.go ./
RUN go install go.k6.io/xk6/cmd/xk6@latest
RUN xk6 build \
    --with github.com/elastic/xk6-output-elasticsearch --replace go.buf.build/grpc/go/prometheus/prometheus=buf.build/gen/go/prometheus/prometheus/protocolbuffers/go@latest --replace go.buf.build/grpc/go/gogo/protobuf=buf.build/gen/go/gogo/protobuf/protocolbuffers/go@latest \
    --with github.com/szkiba/xk6-faker@latest
RUN CGO_ENABLED=0 GOOS=linux go build -o load-test

FROM frolvlad/alpine-glibc as distribution
WORKDIR /app
COPY --from=builder /app/load-test load-test
COPY --from=builder /app/k6 k6
COPY k6-performance-test/ ./k6-performance-test
CMD ./load-test