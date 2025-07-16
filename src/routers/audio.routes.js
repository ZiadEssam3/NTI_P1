
const express = require('express');
const { authenticate } = require('../middlewares/auth/authenticate.middleware');
const uploadByType = require('../middlewares/multer/file.uploads.middleware');
const { addAudioValidator } = require('../middlewares/validation/audio.validator.middleware');
const { uploadAudioHandler } = require('../controllers/audio.controller');
const validateRequest = require('../middlewares/error/validateRequest');

const router = express.Router();

/* 
* @route   POST /api/audio
* @desc    Upload an audio file with cover image, title, genre, and privacy
* @access  Private
*/
router.post(
    '/',
    authenticate,
    uploadByType.audioImageUpload.fields([
        { name: 'audioFile', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    addAudioValidator,
    validateRequest,
    uploadAudioHandler
);


module.exports = router;