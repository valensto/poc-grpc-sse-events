const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const sensorRouter = require('./routes/sensors');
const alertRouter = require('./routes/alerts');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use('/sensors', sensorRouter);
app.use('/alerts', alertRouter);

module.exports = app;
