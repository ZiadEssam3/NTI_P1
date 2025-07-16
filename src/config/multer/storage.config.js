const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../../helpers/error/appError');

// Allowed MIME types mapped to folders
const FILE_TYPES = {
  'image/jpeg': 'images',
  'image/png': 'images',
  'image/jpg': 'images',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'video/mp4': 'video',
  'video/mpeg': 'video',
};

// Ensure folder exists
const ensureDirExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Multer dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = FILE_TYPES[file.mimetype];
    if (!folder) {
      return cb(new AppError('Unsupported file type', 400));
    }

    const fullPath = path.join('uploads', folder);
    ensureDirExists(fullPath);
    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  }
});

module.exports = { storage, FILE_TYPES };
