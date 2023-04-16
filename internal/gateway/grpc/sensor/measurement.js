const client = require("./client");

const addMeasurement = ({projectId, sensorId, field, value}, success, error) => {
    client.addMeasurement({
        project_id: projectId,
        sensor_id: sensorId,
        field: field,
        value: value
    }, (err, _) => {
        if (err) {
            console.log(err)
            return error({
                message: 'Error adding measurement'
            });
        }

        return success({
            message: 'Measurement added'
        });
    });
}

module.exports = {
    addMeasurement
}