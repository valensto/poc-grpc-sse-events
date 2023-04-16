package main

import (
	"context"
	"fmt"
	log "github.com/sirupsen/logrus"
	"github.com/valensto/grpc-poc/shared/genproto/alert"
	"github.com/valensto/grpc-poc/shared/genproto/sensor"
	"github.com/valensto/grpc-poc/shared/server"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
	"os"
)

type grpcServer struct {
	alertClient alert.AlertServiceClient
}

func newGRPCServer() func() {
	port := os.Getenv("GRPC_PORT")
	alertPort := os.Getenv("ALERT_GRPC_ADDR")

	alertClient, closeConn, err := newAlertClient(alertPort)
	if err != nil {
		log.Fatal(err)
	}

	s := grpcServer{
		alertClient: alertClient,
	}

	server.RunGRPCServer(func(server *grpc.Server) {
		sensor.RegisterSensorServiceServer(server, s)
	}, port)

	return func() {
		_ = closeConn()
	}
}

func (g grpcServer) AddMeasurement(ctx context.Context, request *sensor.MeasurementRequest) (*emptypb.Empty, error) {
	g.sendAlert(ctx, request)

	log.Infof("sensor %s has a %s of %v in project %s", request.SensorId, request.Field, request.Value, request.ProjectId)
	return &emptypb.Empty{}, nil
}

func (g grpcServer) sendAlert(_ context.Context, m *sensor.MeasurementRequest) {
	status := alert.AlertStatus_OK
	switch {
	case m.Value < -20 || m.Value > 20:
		status = alert.AlertStatus_CRITICAL
	case m.Value < -10 || m.Value > 10:
		status = alert.AlertStatus_WARNING
	}

	_, err := g.alertClient.SendAlert(context.Background(), &alert.Alert{
		SensorId:  m.SensorId,
		ProjectId: m.ProjectId,
		Message:   fmt.Sprintf("sensor %s has a %s of %v", m.SensorId, m.Field, m.Value),
		Status:    status,
	})
	if err != nil {
		log.Errorf("failed to send alert: %v", err)
	}
}
