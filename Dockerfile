FROM golang:1.22 as builder

WORKDIR /app

COPY ./src ./
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -v -o stamprally

FROM debian:bullseye

# Create and change to the app directory.
WORKDIR /app

RUN apt-get update && \
    apt-get install -y ca-certificates tzdata && \
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# ビルダーステージからコピーする際のディレクトリを修正
COPY --from=builder /app/stamprally /app/
COPY ./src/html ./html

CMD ["/app/stamprally"]
