// Express Router
const express 	= require("express");
const router 	= express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const FirmController = require('../Controllers/FirmController');


// Routes
router.post("/list", jwtAuth, FirmController.list);
router.post("/register", FirmController.register);
router.post("/update-status", jwtAuth, FirmController.updateStatus);
router.post("/update-note", jwtAuth, FirmController.updateNote);
router.post("/delete", jwtAuth, FirmController.delete);


module.exports = router;