// Express Router
const express = require("express");
const router = express.Router();

// Multer
const multer = require('multer');

// Middlewears
const jwtAuth = require('../Middleware/JWTAuth');

// Constants
const Image  = require("../Constants/Image");

// Controllers
const ImageController = require('../Controllers/ImageController');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './Uploads/'+process.env.PROFILE_DIR);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === Image.JPEG || file.mimetype === Image.JPG || file.mimetype === Image.PNG) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * process.env.FILE_SIZE_LIMIT // 1mb * N = N mb
  },
  fileFilter: fileFilter
});


router.post("/update", jwtAuth, upload.single('userImage'), ImageController.update);
router.get("/remove", jwtAuth, ImageController.remove);

module.exports = router;