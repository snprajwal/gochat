package main

import "fmt"

type Server struct {
	clients map[*Client]bool
	broadcast chan []byte
	reg chan *Client
	unreg chan *Client
}

func newServer() *Server {
	return &Server{
		clients: make(map[*Client]bool),
		broadcast: make(chan []byte),
		reg: make(chan *Client),
		unreg: make(chan *Client),
	}
}

func (s *Server) run() {
	for {
		select {
		case c := <-s.reg:
			s.clients[c] = true
		case c := <-s.unreg:
			if _, ok := s.clients[c]; ok {
				delete(s.clients, c)
				close(c.send)
				fmt.Println("Client destroyed")
				fmt.Println(*c)
			}
		case msg := <-s.broadcast:
			for c := range s.clients {
				c.send <- msg
			}
		}
	}
}
