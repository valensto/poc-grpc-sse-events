package main

import (
	"errors"
	log "github.com/sirupsen/logrus"
	"github.com/valensto/grpc-poc/shared/genproto/alert"
	"google.golang.org/grpc"
)

func newAlertClient(addr string) (client alert.AlertServiceClient, close func() error, err error) {
	if addr == "" {
		return nil, func() error { return nil }, errors.New("grpc address is empty")
	}

	conn, err := grpc.Dial(addr, grpc.WithInsecure())
	if err != nil {
		return nil, func() error { return nil }, errors.New("failed to connect to server grpc")
	}

	log.Infoln("connected to alert grpc server")
	return alert.NewAlertServiceClient(conn), conn.Close, nil
}
