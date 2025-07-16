const { body } = require('express-validator');

const addAudioValidator = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),

    body('genre')
        .notEmpty().withMessage('Genre is required'),

    body('isPrivate')
        .optional()
        .isBoolean().withMessage('isPrivate must be a boolean'),
];


const updateAudioValidator = [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('genre').optional().isString().withMessage('Genre must be a string'),
    body('isPrivate').optional().isBoolean().withMessage('isPrivate must be a boolean'),
];
module.exports = {
    addAudioValidator,
    updateAudioValidator
};
