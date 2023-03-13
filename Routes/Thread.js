// Express Router
const express = require("express");
const router = express.Router();

// Multer
const multer = require('multer');

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Constants
const Image = require("../Constants/Image");

// Controllers
const ThreadController = require('../Controllers/ThreadController');
const GroupMessageThreadController = require("../Controllers/GroupThreadController")



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './Uploads/' + process.env.CHAT_DIR);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});


const fileFilter = (req, file, cb) => {
	// reject a file
	if (!req.threadImage || !file.mimetype) {
		cb(null, false);
	}
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


// Routes
router.get("/list", jwtAuth, GroupMessageThreadController.listGroupThread);
router.post("/get-or-create", jwtAuth, GroupMessageThreadController.createGroup);
router.post("/addPersonToGroup", jwtAuth, GroupMessageThreadController.addPerson)
router.post("/deletePersonToGroup", jwtAuth, GroupMessageThreadController.deletePerson)


module.exports = router;