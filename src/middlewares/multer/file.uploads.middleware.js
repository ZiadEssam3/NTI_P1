const multer = require('multer');
const path = require('path');
const AppError = require('../../helpers/error/appError');

// Folder Mapping 
const FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/x-m4a'],
  video: ['video/mp4', 'video/mpeg']
};

const FOLDER_PATHS = {
  image: 'uploads/images',
  audio: 'uploads/audio',
  video: 'uploads/video'
};

function uploadByType(type) {
  const types = type.split(/(?=[A-Z])/).map(t => t.toLowerCase()); // 'audioImage' => ['audio', 'image']

  const allowedTypes = types.flatMap(t => FILE_TYPES[t] || []);
  if (!allowedTypes.length) throw new Error(`Invalid upload type: ${type}`);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const mime = file.mimetype;
      const folderType = Object.keys(FILE_TYPES).find(key => FILE_TYPES[key].includes(mime));
      const destination = FOLDER_PATHS[folderType];

      if (!destination) return cb(new AppError(`No folder configured for file type: ${mime}`, 400));
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
      const uniqueName = `${Date.now()}-${baseName}${ext}`;
      cb(null, uniqueName);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`Only ${types.join(', ')} files are allowed`, 400), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024 // 20MB
    }
  });
}

module.exports = {
  uploadByType,
  imageUpload: uploadByType('image'),
  audioUpload: uploadByType('audio'),
  videoUpload: uploadByType('video'),
  audioImageUpload: uploadByType('audioImage'),
  videoImageUpload: uploadByType('videoImage')
};

