if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const path = require('path');
const shortid = require('shortid');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = cloudinaryStorage({
  cloudinary,
  filename: (req, file, cb) => {
      cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
    },
  allowedFormats: ['jpg', 'png', 'gif']
})

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, 'public/uploads'),
//   filename: (req, file, cb) => {
//     cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
//   }
// })

const upload = multer({storage});
module.exports = upload;

// module.exports = multer({
  // storage
  // limits: {
  //   // maximo de peso de la img
  //   fileSize: 1000000 // 1 MB
  // },
  // // que formato de archivos soporta
  // fileFilter: (req, file, cb) => {
  //   const filetypes = /jpg|jpeg|png|gif/;
  //   // compruebo el mimetype
  //   const mimetype = filetypes.test(file.mimetype);
  //   // compruebo la extension del nombre de archivo
  //   const extname = filetypes.test(path.extname(file.originalname));
  //   console.log(file)
  //   // compruebo que sean correctos y si es asi, devuelvo true
  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   }
  //   cb('Error: el archivo debe ser una imagen válida');

  // }
// });