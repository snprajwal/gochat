package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var port = flag.String("p", ":8080", "Port to run the server on, in the format \":PORT\"")

func main() {
	flag.Parse()
	s := newServer()
	go s.run()
	r := mux.NewRouter()
	fs := http.FileServer(http.Dir("./public"))
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", fs))
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./public/index.html")
	})
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serve(s, w, r)
	})
	log.Fatal(http.ListenAndServe(*port, r))
}
