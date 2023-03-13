// Express Router
const express = require("express");
const router = express.Router();

// Multer
const multer = require('multer');

// Middlewears
const jwtAuth = require('../Middleware/JWTAuth');

// Constants
const File  = require("../Constants/File");

// Controllers
const FileController = require('../Controllers/FileController');


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
  if (file.mimetype === File.PDF) {
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


router.post("/add-to-project", jwtAuth, upload.single('attachment'), FileController.addProjectFile);
router.post("/add", jwtAuth, upload.single('attachment'), FileController.addFile);
router.post("/list-from-project", jwtAuth, FileController.listProjectFiles);
router.post("/list", jwtAuth, FileController.listFiles);
router.post("/delete", jwtAuth, FileController.delete);

module.exports = router;