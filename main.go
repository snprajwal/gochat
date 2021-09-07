package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var port = flag.String("p", ":8080", `Port to run the server on, in the format ":PORT"`)

func main() {
	flag.Parse()
	s := newServer()
	go s.run()
	r := mux.NewRouter()
	fs := http.FileServer(http.Dir("./static"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./static/index.html")
	})
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serve(s, w, r)
	})
	log.Fatal(http.ListenAndServe(*port, r))
}
