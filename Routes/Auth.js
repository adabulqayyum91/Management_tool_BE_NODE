// Express Router
const express 	= require("express");
const router 	= express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const AuthController = require('../Controllers/AuthController');


// Routes
router.post("/login", AuthController.login);

module.exports = router;