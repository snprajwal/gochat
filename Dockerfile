FROM golang:latest

WORKDIR go/src/gochat
COPY . .

RUN go get -d ./...
RUN go install ./...

CMD ["gochat"]
