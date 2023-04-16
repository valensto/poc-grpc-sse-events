package client

/*func NewNotificationClient(grpcPort string) (client notification.NotificationServiceClient, close func() error, err error) {
	if grpcPort == "" {
		return nil, func() error { return nil }, errors.New("grpc port is empty", "failed to connect to grpc server")
	}

	conn, err := grpc.Dial("0.0.0.0:"+grpcPort, grpc.WithInsecure())
	if err != nil {
		return nil, func() error { return nil }, errors.New("failed to connect to server grpc")
	}

	log.Println("connected to notification grpc")
	return notification.NewNotificationServiceClient(conn), conn.Close, nil
}
*/
