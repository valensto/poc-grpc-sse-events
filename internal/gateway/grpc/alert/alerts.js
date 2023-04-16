const client = require("./client");

const syncAlerts = ({projectID, sessionID}, onData, onEnd) => {
    let call = null;
    let connected = false;

    const connect = () => {
        call = client.syncAlerts({
            project_id: projectID,
            session_id: sessionID
        });

        console.log(`new gateway session [${sessionID}] connected to alerts events for project [${projectID}]`);
        connected = true;

        call.on('data', function (alert) {
            onData(`id: ${sessionID}\ndata: ${JSON.stringify(alert)}\n\n`);
        });

        call.on('end', function () {
            console.log(`gateway with sessionId [${sessionID}] disconnected from alerts events for project [${projectID}]`);
        });

        call.on('error', function (err) {
            console.error("error: ", err.message);
            if (connected) {
                setTimeout(connect, 5000);
            }
        });
    };

    connect();
    return function () {
        connected = false;
        if (call !== null) {
            call.cancel();
        }
    }
};

module.exports = {
    syncAlerts
};