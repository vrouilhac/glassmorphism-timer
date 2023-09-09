package main

import (
	"log"
	"net/http"
)

// TODO: log vs fmt

func main() {
	public := http.FileServer(http.Dir("public"))
	http.Handle("/", public)

	log.Println("Starting server on port 8080...")

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		log.Fatal("An error occured")
	}
}
