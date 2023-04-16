import {Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {useCallback, useEffect, useState} from "react";

export const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [eventSource, setEventSource] = useState(null);

    const syncAlerts = useCallback(async () => {
        const es = new EventSource(`${process.env.REACT_APP_API_URL}/alerts?projectID=project-1`);
        setEventSource(es);
    }, [])

    useEffect(() => {
        if (eventSource) {
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data)

                setAlerts((prevState) => [...prevState, {
                    key: new Date().getTime(),
                    sensorId: data.sensor_id,
                    message: data.message,
                    status: data.status
                }])
            };

            eventSource.onerror = (err) => {
                console.error("EventSource error:", err);
            };
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    useEffect(() => {
        syncAlerts()
    }, [syncAlerts]);

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case "WARNING":
                return "warning"
            case "CRITICAL":
                return "error"
            default:
                return "success"
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Sensor</TableCell>
                        <TableCell align="right">Message</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alerts.map((alert) => (
                        <TableRow
                            key={alert.key}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {alert.sensorId}
                            </TableCell>
                            <TableCell align="right">{alert.message}</TableCell>
                            <TableCell align="right">
                                <Chip label={alert.status} size={"small"} color={getStatusColor(alert.status)}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}