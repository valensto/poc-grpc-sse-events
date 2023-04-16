package server

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
)

func RunGRPCServer(registerServer func(server *grpc.Server), port string) {
	if port == "" {
		log.Fatal("port for GRPC server is empty")
	}
	addr := fmt.Sprintf(":%s", port)
	RunGRPCServerOnAddr(addr, registerServer)
}

func RunGRPCServerOnAddr(addr string, registerServer func(server *grpc.Server)) {
	grpcServer := grpc.NewServer()
	registerServer(grpcServer)

	listen, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Starting: gRPC Listener")
	log.Fatal(grpcServer.Serve(listen))
}
