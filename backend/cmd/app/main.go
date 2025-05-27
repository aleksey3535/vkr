package main

import "queueAppV2/internal/app"

func main() {
	server := dev.New()
	if err := server.Run(); err != nil {
		server.Stop()
	}
}