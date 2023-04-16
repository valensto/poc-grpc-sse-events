import React from "react";
import {Container, Grid} from "@mui/material";
import {Alerts, SendMeasurements} from "./components";

function App() {
    return (
        <Container maxWidth="md" style={{paddingTop: "50px"}}>
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <SendMeasurements/>
                </Grid>
                <Grid item xs={12}>
                    <Alerts/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
