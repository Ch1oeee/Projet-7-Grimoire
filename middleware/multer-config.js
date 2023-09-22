const multer = require('multer');
const sharp = require("sharp");
const path = require("path");
const fs = require ('fs')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single("image");

// REDIMENTIONNER L'IMAGE
const imageOptimization = (req, res, next) => {
  console.log('Middleware imageResizer started');
  if (!req.file) {
    console.log('No file to resize');
    return next();
  }

  const filePath = req.file.path;
  const outputFilePath = filePath + '.webp';

  sharp(filePath)
  .resize({ width: 400 })
  .webp()
  .toFile(outputFilePath, (err) => {
    if (err) {
      console.error('Error resizing image:', err);
      return next(err);
    }
    console.log('Image resized successfully');
    next();
});
};


module.exports = {
  upload, 
  imageOptimization,
};
