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
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, "index.html")
	})
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serve(s, w, r)
	})
	log.Fatal(http.ListenAndServe(*port, r))
}
