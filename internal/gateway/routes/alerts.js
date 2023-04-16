const express = require('express');
const {syncAlerts} = require("../grpc/alert/alerts");

const router = express.Router();

router.get('/', function (req, res, next) {
    const projectID = req.query.projectID;
    const sessionID = Math.random().toString(36).substring(2);

    const disconnectClient = syncAlerts(
        {projectID, sessionID},
        res.write.bind(res),
        res.end.bind(res)
    );

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    req.on('close', function () {
        console.log("on close")
        disconnectClient();
    });
});


module.exports = router;
