// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth');

// Constants
const Role = require("../Constants/Role");

// Controllers
const ProjectController = require('../Controllers/ProjectController');


// Routes
router.post("/list", jwtAuth, ProjectController.list);
router.get("/list-own", jwtAuth, ProjectController.listOwnProjects);
router.get("/list-firm", jwtAuth, ProjectController.listFirmProjects);
router.post("/add", jwtAuth, ProjectController.add);
router.post("/update-status", jwtAuth, ProjectController.updateStatus);
router.post("/update-custom-field-option", jwtAuth, ProjectController.updateCustomFieldOption);
router.post("/update-type", jwtAuth, ProjectController.updateType);
router.post("/update-title", jwtAuth, ProjectController.updateTitle);
router.post("/update-description", jwtAuth, ProjectController.updateDescription);
router.post("/update-company", jwtAuth, ProjectController.updateCompany);
router.post("/update-project", jwtAuth, ProjectController.updateProjectField);
router.post("/update-privacy", jwtAuth, ProjectController.updatePrivacy);
router.post("/delete", jwtAuth, ProjectController.delete);
router.get("/detail/:projectId", jwtAuth, ProjectController.detail);
router.post("/list-tasks", jwtAuth, ProjectController.list);
router.post("/recent-projects", jwtAuth, ProjectController.recentProjects);


module.exports = router;