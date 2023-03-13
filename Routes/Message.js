// Express Router
const express = require("express");
const router = express.Router();

// Multer
const multer = require('multer');

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Constants
const Image  = require("../Constants/Image");
const File  = require("../Constants/File");

// Controllers
const MessageController = require('../Controllers/MessageController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './Uploads/'+process.env.MEDIA_DIR);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === Image.JPEG || file.mimetype === Image.JPG || file.mimetype === Image.PNG || file.mimetype === File.PDF) {
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
  // TODO: For future reference
  // fileFilter: fileFilter
});



// Routes
router.get("/list/:threadId", jwtAuth, MessageController.list);
router.post("/create", jwtAuth, MessageController.create);
router.post("/upload-file", jwtAuth, upload.single('attachment'), MessageController.uploadFile);


module.exports = router;