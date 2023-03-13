// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const UserActivityController = require('../Controllers/UserActivityController');


// Routes
router.post("/list", jwtAuth, UserActivityController.list);
router.get("/list-recent", jwtAuth, UserActivityController.listRecentActivity);


module.exports = router;