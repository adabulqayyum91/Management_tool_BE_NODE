// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth'); 

// Constants
const Role 	= require("../Constants/Role");

// Controllers
const ProjectUserController = require('../Controllers/ProjectUserController');


// Routes
router.post("/list-participant", jwtAuth, ProjectUserController.listParticipant);
router.post("/delete-participant", jwtAuth, ProjectUserController.deleteParticipant);
router.post("/add-participant", jwtAuth, ProjectUserController.addParticipant);
router.post("/list-available-participant", jwtAuth, ProjectUserController.listAvailableParticipant);

module.exports = router;