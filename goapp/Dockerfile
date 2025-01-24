FROM golang:alpine AS build
WORKDIR /app
COPY go.* .
RUN go mod download
COPY . .
RUN go build -o /godocker
EXPOSE 3000
FROM alpine:latest


COPY --from=build /godocker /godocker
RUN apk --no-cache add ca-certificates dumb-init
RUN chmod +x /godocker

CMD [ "/godocker" ]