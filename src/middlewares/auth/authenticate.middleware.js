const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../../helpers/error/appError');

require('dotenv').config();

// Promisify jwt.verify to use async/await
const verifyToken = promisify(jwt.verify);
/**
 * @middleware authenticate
 * @desc Middleware to verify JWT token in Authorization header (Bearer token).
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return next(new AppError('Token missing', 401));
        }
        const decoded = await verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token', 403));
    }
};

module.exports = { authenticate };
