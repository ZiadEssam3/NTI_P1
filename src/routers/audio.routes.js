
const express = require('express');
const { authenticate } = require('../middlewares/auth/authenticate.middleware');
const uploadByType = require('../middlewares/multer/file.uploads.middleware');
const { addAudioValidator, updateAudioValidator } = require('../middlewares/validation/audio.validator.middleware');
const {
    uploadAudioHandler,
    getPublicAudiosHandler,
    getMyOwnAudiosHandler,
    streamAudioHandler,
    updateAudioHandler,
    deleteAudioHandler
} = require('../controllers/audio.controller');
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

// get all routes 
router.get('/', validateRequest, getPublicAudiosHandler);

/**
 * @route   GET /api/audio/mine
 * @desc    View your uploaded audio files (public + private)
 * @access  Private
 */
router.get('/mine', authenticate, validateRequest, getMyOwnAudiosHandler);

/**
 * @route   GET /api/audio/stream/:id
 * @desc    Stream an audio file
 * @access  Public or Private (authenticated users if needed)
 */
router.get('/stream/:audioId', validateRequest, streamAudioHandler);



router.put(
    '/:audioId',
    authenticate,
    uploadByType.imageUpload.single('coverImage'),
    updateAudioValidator,
    validateRequest,
    updateAudioHandler
);

router.delete('/:audioId', authenticate, validateRequest, deleteAudioHandler);


module.exports = router;