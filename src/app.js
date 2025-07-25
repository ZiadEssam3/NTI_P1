const express = require('express');
// const { logRequests } = require('./middlewares/log/logger.middleware');
const errorHandler = require('./middlewares/error/errorHandler');
require('dotenv').config()
const userRouter = require('./routers/user.routes');
const audioRouter = require('./routers/audio.routes')
const adminRouter = require('./routers/admin.routes')
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
// swagger 
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const basicAuth = require('express-basic-auth');
const path = require('path');
const AppError = require('./helpers/error/appError');
const { ERRORS } = require('./helpers/error/constants');
const { limiter } = require('./middlewares/performance/rateLimiter.middleware');
const api = process.env.API;
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openAPI.yaml'));


const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// app.use(logRequests);
app.use(`${api}/users`, userRouter);
app.use(`${api}/audio`, audioRouter);
app.use(`${api}/admin`, adminRouter);


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the API. Use routes under ' + api
    });
});

// Basic authentication for Swagger UI
app.use(
    '/api-docs',
    basicAuth({
        users: { admin: 'password123' },
        challenge: true,
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


// Catch all unmatched routes
app.all('*', (req, res, next) => {
    next(new AppError(`${ERRORS.ROUTE_NOT_FOUND}: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;