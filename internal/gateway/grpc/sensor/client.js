const PROTO_PATH = __dirname + '/../../../api/protobuf/sensor.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const client = new protoDescriptor.sensor.SensorService(process.env.SENSOR_GRPC_ADDR, grpc.credentials.createInsecure());

module.exports = client