// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth'); 

// Constants
const Role 	= require("../Constants/Role");

// Controllers
const DesignationController = require('../Controllers/DesignationController');


// Routes
router.get("/list", jwtAuth, DesignationController.list);
router.post("/add", jwtAuth, DesignationController.add);
router.post("/update", jwtAuth, DesignationController.update);
router.post("/delete", jwtAuth, DesignationController.delete);

module.exports = router;