package main

import (
	"bytes"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Pixel struct {
	R int
	G int
	B int
	A int
}

type Game struct {
	Buffer *image.RGBA
	Ctx    interface{}
}

func (g *Game) Run(ws *websocket.Conn) {
	width := 192
	height := 108

	upLeft := image.Point{0, 0}
	lowRight := image.Point{width, height}

	img := image.NewRGBA(image.Rectangle{upLeft, lowRight})

	// Colors are defined by Red, Green, Blue, Alpha uint8 values.
	cyan := color.RGBA{100, 200, 200, 0xff}

	// Set color for each pixel.
	for true {
		for x := 0; x < width; x++ {
			for y := 0; y < height; y++ {
				switch {
				case x < width/2 && y < height/2: // upper left quadrant
					img.Set(x, y, cyan)
				case x >= width/2 && y >= height/2: // lower right quadrant
					img.Set(x, y, color.White)
				default:
					// Use zero value.
					rand.Seed(time.Now().UnixNano())
					if rand.Intn(3) > 1 {
						img.Set(x, y, cyan)
					} else {
						img.Set(x, y, color.White)
					}
				}
			}
		}

		g.Buffer = img
		g.Update(ws)
		// time.Sleep(30 * time.Millisecond)
	}

}

func (g *Game) Update(ws *websocket.Conn) {
	if err := ws.WriteMessage(websocket.TextMessage, []byte(g.Encode())); err != nil {
		return
	}
}

func (g *Game) Frame() *image.RGBA {
	return g.Buffer
}

func (g *Game) Encode() string {
	buf := new(bytes.Buffer)
	frame := g.Frame()
	err := jpeg.Encode(buf, frame, nil)
	if err != nil {
		panic(err)
	}
	f := base64.StdEncoding.EncodeToString(buf.Bytes())
	data := "data:image/png;base64," + f
	return data
}

type IGame interface {
	Run(*websocket.Conn)
	Frame() *image.RGBA
}

func basicGame() *Game {
	game := &Game{}
	return game
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  512,
	WriteBufferSize: 2048,
}

func newKey() string {
	var key string
	bytes := make([]byte, 16)
	rand.Seed(time.Now().UnixNano())
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}

	key = hex.EncodeToString(bytes)
	return key
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func Check(action func(chan struct{}), interval time.Duration) func() {
	t := time.NewTicker(interval)
	q := make(chan struct{})
	go func() {
		for {
			select {
			case <-t.C:
				action(q)
			case <-q:
				t.Stop()
				return
			}
		}
	}()
	return func() {
		close(q)
	}
}

func main() {
	router := gin.Default()

	var games map[string]IGame
	games = make(map[string]IGame)
	var lastGameReq = make(map[string]time.Time)

	fmt.Println("Server instance with key:", newKey())

	router.Use(CORSMiddleware())

	router.GET("/frame/:key", func(ctx *gin.Context) {

		// ctx.String(200, data)
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
		games[ctx.Param("key")].Run(ws)
		Check(func(t chan struct{}) {
			if err := ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}, 3*time.Second)
		if err != nil {
			panic(err)
		}
	})

	router.GET("/new", func(ctx *gin.Context) {
		key := newKey()
		games[key] = basicGame()
		lastGameReq[key] = time.Now()
		Check(func(t chan struct{}) {
			if time.Since(lastGameReq[key]) > 5*time.Minute {
				games[key] = nil
				close(t)
				fmt.Println("Closed session", key)
			}
		}, 30*time.Second)
		ctx.String(200, key)
	})

	router.Run()
}
