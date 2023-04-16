package main

import (
	"context"
	log "github.com/sirupsen/logrus"
	"github.com/valensto/grpc-poc/shared/genproto/alert"
	"github.com/valensto/grpc-poc/shared/server"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
	"os"
)

type grpcServer struct {
	alerts map[string]map[string]chan *alert.Alert
}

func newGRPCServer() {
	port := os.Getenv("GRPC_PORT")
	s := grpcServer{
		alerts: make(map[string]map[string]chan *alert.Alert),
	}

	server.RunGRPCServer(func(server *grpc.Server) {
		alert.RegisterAlertServiceServer(server, s)
	}, port)
}

func (g grpcServer) SendAlert(_ context.Context, request *alert.Alert) (*emptypb.Empty, error) {
	if alerts, ok := g.alerts[request.ProjectId]; ok {
		for _, a := range alerts {
			a <- &alert.Alert{
				SensorId: request.SensorId,
				Message:  request.Message,
				Status:   request.Status,
			}
		}
	}

	log.Infof("alert sent to %d clients with status %s", len(g.alerts[request.ProjectId]), request.Status.String())
	return &emptypb.Empty{}, nil
}

func (g grpcServer) SyncAlerts(req *alert.SyncAlertsRequest, stream alert.AlertService_SyncAlertsServer) error {
	ctx := stream.Context()
	projectID := req.ProjectId
	sessionID := req.SessionId
	log.Infof("client [%s] connected to alert alerts from project %s", sessionID, projectID)

	if _, ok := g.alerts[projectID]; !ok {
		g.alerts[projectID] = make(map[string]chan *alert.Alert)
	}

	alerts := make(chan *alert.Alert)
	g.alerts[projectID][sessionID] = alerts

	defer func() {
		close(alerts)
		delete(g.alerts[projectID], sessionID)
		if len(g.alerts[projectID]) == 0 {
			delete(g.alerts, projectID)
		}
	}()

	for {
		select {
		case a := <-alerts:
			log.Infof("sending alert to client [%s] for the project %s", sessionID, projectID)
			err := stream.Send(a)
			if err != nil {
				return err
			}
		case <-ctx.Done():
			log.Infof("client [%s] disconnected alert alerts from project %s", sessionID, projectID)
			return nil
		}
	}
}
