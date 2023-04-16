package main

func main() {
	cleanup := newGRPCServer()
	defer cleanup()
}
