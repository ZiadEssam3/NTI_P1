const { validationResult } = require('express-validator');
const AppError = require('../../helpers/error/appError');
const { ERRORS } = require('../../helpers/error/constants');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(ERRORS.VALIDATION_ERROR + ': ' +
            errors.array().map(err => err.msg).join(', '), 400));
    }
    next();
};

module.exports = validateRequest;
