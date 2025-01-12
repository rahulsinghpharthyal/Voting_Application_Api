import multer from 'multer';
import ErrorHandler from './error.js';

// Memory storage for Multer
const storage = multer.memoryStorage();

// File filter function to check for JPEG and PNG formats
const fileFilter =(req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  console.log('this is file', file)
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else { 
    cb(new multer.MulterError('Invalid file type. Only JPEG and PNG are allowed.', 400), false); 
  }
};

// Multer setup with file size limit and file filter
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024, // 100kb limit
  },
  fileFilter,
}).single('file')

export { upload };
