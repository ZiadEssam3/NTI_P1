const { body, validationResult } = require('express-validator');


const signupValidator = [
    body('username')
        .notEmpty().withMessage('username is required')
        .isLength({ min: 3 }).withMessage('username must be at least 3 characters')
    ,
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalied email Address')
    ,
    body('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 8 }).withMessage('Password Must be at least 8 characters')
        .matches(/[0-9]/).withMessage('password must contain a number')
        .matches(/[!@#$%^&*=+]/).withMessage('password must contain a special character')
    ,
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Invalied role')

]


module.exports = { 
    signupValidator
}