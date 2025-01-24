// 🚀 Fiber is an Express inspired web framework written in Go with 💖
// 📌 API Documentation: https://docs.gofiber.io
// 📝 Github Repository: https://github.com/gofiber/fiber

// SocketIO Chat Example

package main

import (
	"fmt"
	"log"

	"database/sql"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"golang.org/x/exp/rand"
)

// MessageObject Basic chat message object
type MessageObject struct {
	Data string `json:"data"`
	From string `json:"from"`
	To   string `json:"to"`
}

type PlayerObject struct {
	UserId     string `json:"user_id"`
	Room       string `json:"room"`
	PlayerName string `json:"player_name"`
}

type Player struct {
	PlayerId string `json:"user_id"`
	Client   *websocket.Conn
}

type Room struct {
	RoomId  string `json:"room_id"`
	Players []Player
}

func main() {

	app := fiber.New()

	// list of rooms
	rooms := make(map[string]*Room)

	connStr := "user=postgres password=postgres dbname=dogefight host=db sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println("Error opening database connection")
		log.Fatal(err)
	}
	defer db.Close()

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// create handler for websocket not socketio
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		player := new(Player)
		player.Client = c
		for {
			// Read message from browser
			msg := new(MessageObject)
			err := c.ReadJSON(msg)
			if err != nil {
				log.Println("read:", err)
				break
			}
			// Send message to browser
			err = c.WriteJSON(msg)
			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}))

	log.Fatal(app.Listen(":3000"))
}

func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
