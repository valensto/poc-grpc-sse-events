const express = require('express');
const {addMeasurement} = require("../grpc/sensor/measurement");

const router = express.Router();

router.post('/:id/measurement', async (req, res, next) => {
    const {field, value, projectId} = req.body;
    const sensorId = req.params.id;

    const missing = [];
    if (!projectId) {
        missing.push('projectId');
    }
    if (!field) {
        missing.push('field');
    }
    if (!value) {
        missing.push('value');
    }
    if (missing.length > 0) {
        return res.status(400).send({
            message: `Missing required fields: ${missing.join(', ')}`
        });
    }

    addMeasurement({projectId, sensorId, field, value}, (success) => {
        return res.status(200).send(success);
    }, (err) => {
        return res.status(500).send(err);
    });
});


module.exports = router;
