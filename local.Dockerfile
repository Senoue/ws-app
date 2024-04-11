FROM golang:1.22-alpine3.19 as dev

RUN apk --no-cache add ca-certificates curl

ENV TZ=Asia/Tokyo
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /app/src

RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

CMD ["air", "-c", ".air.toml"]