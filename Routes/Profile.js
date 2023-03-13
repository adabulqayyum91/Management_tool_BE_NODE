// Express Router
const express 	= require("express");
const router 	= express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const ProfileController = require('../Controllers/ProfileController');


// Routes
router.get("/admin-detail", jwtAuth, ProfileController.adminDetail);
router.post("/admin-update", jwtAuth, ProfileController.adminUpdate);
router.get("/staff-detail", jwtAuth, ProfileController.staffDetail);
router.post("/staff-update", jwtAuth, ProfileController.staffUpdate);
router.get("/client-detail", jwtAuth, ProfileController.clientDetail);
router.post("/client-update", jwtAuth, ProfileController.clientUpdate);

module.exports = router;