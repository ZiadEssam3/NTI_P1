const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @function GenerateAccessToken
 * @desc Generates a short-lived JWT access token for authentication
 * @param {string} userId - Unique ID of the user
 * @param {string} email - Email of the user
 * @returns {string} Signed JWT access token valid for 1 hour
 */
function GenerateAccessToken(userId) {
    const payload = { userId };
    const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET;
    const options = { expiresIn: '30m' };
    return jwt.sign(payload, secretKey, options);
}

/**
 * @function GenerateRefreshToken
 * @desc Generates a long-lived JWT refresh token to renew access tokens
 * @param {string} userId - Unique ID of the user
 * @param {string} email - Email of the user
 * @returns {string} Signed JWT refresh token valid for 1 year
 */
function GenerateRefreshToken(userId) {
    const payload = { userId };
    const secretKey = process.env.JWT_REFRESH_TOKEN_SECRET;
    const options = { expiresIn: '1y' };

    return jwt.sign(payload, secretKey, options);
}

module.exports = {
    GenerateAccessToken,
    GenerateRefreshToken,
};