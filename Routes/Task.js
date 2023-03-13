// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth');

// Constants
const Role = require("../Constants/Role");

// Controllers
const TaskController = require('../Controllers/TaskController');
const SubTaskController = require('../Controllers/SubTaskController');


// Routes
router.post("/list", jwtAuth, TaskController.list);
router.post("/add", jwtAuth, TaskController.add);
router.post("/update-status", jwtAuth, TaskController.updateStatus);
router.post("/list-available-participant", jwtAuth, TaskController.listAvailableParticipant);
router.post("/start-time", jwtAuth, TaskController.startTime);
router.post("/stop-time", jwtAuth, TaskController.stopTime);
router.post("/delete", jwtAuth, TaskController.delete);
router.post("/update", jwtAuth, TaskController.update);


router.post("/list-subtask", jwtAuth, SubTaskController.list);
router.post("/add-subtask", jwtAuth, SubTaskController.add);
router.post("/update-status-subtask", jwtAuth, SubTaskController.updateStatus);
router.post("/delete-subtask", jwtAuth, SubTaskController.deleteSubtask);
router.post("/update-subtask", jwtAuth, SubTaskController.update);

module.exports = router;