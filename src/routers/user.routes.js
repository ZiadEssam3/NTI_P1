const express = require('express');
const {
    signupHandler,
    loginHandler,
    GetUserProfileHandler,
    updateProfileHandler
} = require('../controllers/user.controller');
const { signupValidator } = require('../middlewares/validation/signup.validator.middleware');
const { loginValidator } = require('../middlewares/validation/login.validator.middleware');
const validateRequest = require('../middlewares/error/validateRequest');
const { authenticate } = require('../middlewares/auth/authenticate.middleware');
const uploadByType = require('../middlewares/multer/file.uploads.middleware');
const router = express.Router();

/**
 * @route   POST /user/signup
 * @desc    Validates and registers a new user with hashed password
 * @access  Public
 * @middleware registerValidator - Ensures required fields (email, password, username , profilePicture) are valid
 * @returns {201} User registered successfully
 * @returns {400} Validation errors
 * @returns {500} Server error
 */
router.post(
    '/signup'
    , uploadByType.imageUpload.single('profilePicture'),
    signupValidator,
    validateRequest,
    signupHandler
);

/**
 * @route   POST /user/login
 * @desc    Validates and logs in an existing user
 * @access  Public
 * @middleware loginValidator - Validates login input (email and password)
 * @returns {201} User logged in successfully
 * @returns {400} Validation errors
 * @returns {401} Invalid credentials
 * @returns {500} Server error
 */
router.post('/login', loginValidator, validateRequest, loginHandler);


/**
 * @route   GET /user/profile
 * @desc    Get user profile
 * @access  Private (requires authentication)
 */
router.get("/profile", authenticate, validateRequest, GetUserProfileHandler);



router.put('/profile', authenticate, uploadByType.imageUpload.single('profilePicture'), validateRequest, updateProfileHandler);





module.exports = router;