const express = require('express');
const { logRequests } = require('./middlewares/log/logger.middleware');
const errorHandler = require('./middlewares/error/errorHandler');
require('dotenv').config()
const userRouter = require('./routers/user.routes');
const audioRouter = require('./routers/audio.routes')
const adminRouter = require('./routers/admin.routes')
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const AppError = require('./helpers/error/appError');
const path = require('path');
const { ERRORS } = require('./helpers/error/constants');
const { limiter } = require('./middlewares/performance/rateLimiter.middleware');
const api = process.env.API;


const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(logRequests);
app.use(`${api}/users`, userRouter);
app.use(`${api}/audio`, audioRouter);
app.use(`${api}/admin`, adminRouter);


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the API. Use routes under ' + api
    });
});

// Catch all unmatched routes
app.all('*', (req, res, next) => {
    next(new AppError(`${ERRORS.ROUTE_NOT_FOUND}: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;