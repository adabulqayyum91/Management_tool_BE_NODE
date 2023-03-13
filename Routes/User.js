// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const UserController = require('../Controllers/UserController');


// Routes
router.get("/list-available-client-staff", jwtAuth, UserController.listAvailableClientStaff);
router.get("/list-available-client-staff-in-groups", jwtAuth, UserController.listAvailableClientStaffInGroups);


module.exports = router;