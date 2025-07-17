const asyncWrapper = require("../../helpers/error/asyncWrapper");

/**
 * @function authorizeRole
 * @desc Middleware to restrict access to routes based on user role
 * @param {string} requireRole - The role required to access the route (e.g., 'admin')
 * @returns {Function} Express middleware function wrapped in asyncWrapper
 */
function authorizeRole(requireRole) {
    return asyncWrapper(async (req, res, next) => {
        if (!req.user || req.user.role !== requireRole) {
            return res.status(403).json({ message: 'Access Denied!' });
        }
        next();
    });
}

module.exports = {
    authorizeRole
};
