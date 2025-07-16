const rateLimit = require('express-rate-limit');

// Create a limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // each IP can make 2 requests per window
});

module.exports = {
    limiter
}