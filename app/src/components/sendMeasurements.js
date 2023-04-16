import React, {useCallback, useEffect} from "react";
import {Box, FormControlLabel, Grid, LinearProgress, Slider, Switch} from "@mui/material";

const marks = [
    {
        value: -40,
        label: '-40°C',
    },
    {
        value: -20,
        label: '-20°C',
    },
    {
        value: 0,
        label: '2°C',
    },
    {
        value: 20,
        label: '20°C',
    },
    {
        value: 40,
        label: '40°C',
    },
];

function valuetext(value) {
    return `${value}°C`;
}

let interval
export const SendMeasurements = ({measurements, sendMeasurements}) => {
    const [values, setValues] = React.useState([-20, 20]);
    const [sending, setSending] = React.useState(false);

    const handleChange = (event, newValue) => {
        setValues(newValue);
    };

    const send = useCallback(() => {
        clearInterval(interval)
        interval = setInterval(async () => {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/sensors/bosh-1/measurement`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        projectId: "project-1",
                        field: "temperature",
                        value: Math.floor(Math.random() * (values[1] - values[0] + 1)) + values[0],
                    })
                })
            } catch (e) {
                console.log(e)
            }
        }, 2000)

    }, [values])

    useEffect(() => {
        if (sending) {
            send()
            return
        }

        if (interval) {
            clearInterval(interval)
        }
    }, [sending, send])

    useEffect(() => {
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [])

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <FormControlLabel
                        sx={{
                            display: 'block',
                        }}
                        control={
                            <Switch
                                checked={sending}
                                onChange={() => setSending(!sending)}
                                name="Sending"
                                color="primary"
                            />
                        }
                        label={sending ? "Sending" : "Not sending"}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Slider
                        aria-label="Always visible"
                        value={values}
                        onChange={handleChange}
                        getAriaValueText={valuetext}
                        step={5}
                        min={-40}
                        max={40}
                        marks={marks}
                        valueLabelDisplay="on"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{width: '100%'}}>
                        <LinearProgress variant={sending ? "indeterminate" : "determinate"} value={0}/>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}