// Express Router
const express 	= require("express");
const router 	= express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth'); 

// Constants
const Role 	= require("../Constants/Role");

// Controllers
const DashboardController = require('../Controllers/DashboardController');


// Routes
router.get("/super-admin-counters", jwtAuth, roleAuth.check(Role.SUPER_ADMIN), DashboardController.superAdminCounters);
router.get("/admin", jwtAuth, roleAuth.check(Role.ADMIN), DashboardController.admin);
router.get("/staff", jwtAuth, roleAuth.check(Role.STAFF), DashboardController.staff);
router.get("/client", jwtAuth, roleAuth.check(Role.CLIENT), DashboardController.client);


module.exports = router;