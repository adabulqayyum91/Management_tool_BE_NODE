// Express Router
const express 	= require("express");
const router 	= express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const PasswordController = require('../Controllers/PasswordController');


// Routes
router.post("/forgot", PasswordController.forgot);
router.post("/reset", PasswordController.reset);
router.post("/change", jwtAuth, PasswordController.change);
router.post("/first-time-update", PasswordController.firstTimeUpdate);


module.exports = router;