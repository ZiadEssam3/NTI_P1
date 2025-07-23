const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

// Check if running on Vercel or production
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Ensure ./src/logs directory exists (only for local)
const logDir = path.join(__dirname, '../../logs');
if (!isVercel && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Create Winston logger
const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        // Only use file transport when not on Vercel
        ...(!isVercel ? [
            new transports.File({ filename: path.join(logDir, 'server.log') })
        ] : [])
    ]
});

module.exports = logger;
