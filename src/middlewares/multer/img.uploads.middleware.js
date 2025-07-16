// middlewares/upload.js
const multer = require('multer');
const { storage, FILE_TYPES } = require('../../config/multer/storage.config');
const AppError = require('../../helpers/error/appError');

// File validation middleware
const fileFilter = (req, file, cb) => {
  if (FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new AppError('Only image, audio, and video files are allowed!', 400), false);
  }
};

// Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

module.exports = upload;
