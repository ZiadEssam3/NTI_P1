const bcrypt = require('bcrypt');
const AppError = require("../helpers/error/appError");
const asyncWrapper = require("../helpers/error/asyncWrapper");
const { User } = require('../models/user.model');
const { GenerateAccessToken, GenerateRefreshToken } = require('../helpers/token/jwt.helper');


/**
 * @function signupHandler
 * @desc Registers a new user, hashes the password, saves the user, and returns a JWT token.
 * @route POST /api/users/signup
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
/*let signupHandler = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const profilePicture = req.file ? req.file.filename : null;
        
    
    
    
    } catch (error) {

    }
}*/
let signupHandler = asyncWrapper(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/images/`;
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('User already exists', 400));
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        profilePicture: `${basePath}${fileName}`
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePicture: newUser.profilePicture
        }
    });
});

/**
 * @function loginHandler
 * @desc Authenticates a user by verifying email and password, returns JWT access token, and sets refresh token in cookie.
 * @route POST /user/login
 * @access Public
 * @param {Object} req - Express request object containing email and password in the body
 * @param {Object} res - Express response object returning status and token
 */
let loginHandler = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError('Invalied Email or Password', 401));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError('Invalied Email or Password', 401));
    const accessToken = GenerateAccessToken(user._id, user.email, user.role);
    const refreshToken = GenerateRefreshToken(user._id, user.email, user.role);
    res.cookie('_rftq', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        message: 'User LogedIn Successfully!!',
        accessToken
    });

});


/**
 * @function GetProfileHandler
 * @desc Retrieves the authenticated user's profile (excluding password).
 * @route GET /api/users/profile
 * @access Private
 * @param {Object} req - Express request object (should have user from JWT)
 * @param {Object} res - Express response object
 */
let GetUserProfileHandler = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return next(new AppError('User Not Found', 404));
    res.status(200).json({ message: 'Your Profile info:', user });
});

let updateProfileHandler = asyncWrapper(async (req, res, next) => {
    const userId = req.user.userId;
    const { username } = req.body;
    let profilePictureUrl = null;

    if (req.file) {
        const basePath = `${req.protocol}://${req.get('host')}/uploads/images/`;
        profilePictureUrl = `${basePath}${req.file.filename}`;
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (profilePictureUrl) updateFields.profilePicture = profilePictureUrl;

    const updateduser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true,
        select: '-password'
    });

    if (!updateduser) return next(new AppError('User Not Found', 404));

    res.status(200).json({ sucess: true, message: 'Profile Updated Sucessfully', data: updateduser });
});

module.exports = {
    signupHandler,
    loginHandler,
    GetUserProfileHandler,
    updateProfileHandler
}