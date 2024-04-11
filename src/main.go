package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/olahol/melody"
)

type GopherInfo struct {
	ID, X, Y, Score string
}

func main() {

	r := gin.Default()
	m := melody.New()

	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleConnect(func(s *melody.Session) {
		ss, _ := m.Sessions()

		for _, o := range ss {
			value, exists := o.Get("info")

			if !exists {
				continue
			}
			info := value.(*GopherInfo)
			s.Write([]byte("set " + info.ID + " " + info.X + " " + info.Y + " " + info.Score))
		}

		id := uuid.NewString()
		s.Set("info", &GopherInfo{id, "0", "0", "0"})

		s.Write([]byte("iam " + id))
	})

	m.HandleDisconnect(func(s *melody.Session) {
		value, exists := s.Get("info")

		if !exists {
			return
		}

		info := value.(*GopherInfo)

		m.BroadcastOthers([]byte("dis "+info.ID), s)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		p := strings.Split(string(msg), " ")
		value, exists := s.Get("info")

		if len(p) != 3 || !exists {
			return
		}

		info := value.(*GopherInfo)
		info.X = p[0]
		info.Y = p[1]
		info.Score = p[2]

		m.BroadcastOthers([]byte("set "+info.ID+" "+info.X+" "+info.Y+" "+info.Score), s)
	})

	r.GET("/", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "html/top.html")
	})

	r.GET("/score", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "html/score.html")
	})

	// css を返却
	r.Static("/css", "html/css")
	// js を返却
	r.Static("/js", "html/js")
	// image を返却
	r.Static("/images", "html/images")

	r.Run(":8080")
}
