// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');
const roleAuth = require('../Middleware/RoleAuth'); 

// Constants
const Role 	= require("../Constants/Role");

// Controllers
const CustomFieldController = require('../Controllers/CustomFieldController');


// Routes
router.get("/get-with-options", jwtAuth, CustomFieldController.getWithOptions);
router.post("/update-label", jwtAuth, CustomFieldController.updateLabel);
router.post("/add-option", jwtAuth, CustomFieldController.addOption);
router.post("/update-option", jwtAuth, CustomFieldController.updateOption);
router.post("/delete-option", jwtAuth, CustomFieldController.deleteOption);
router.post("/toggleHide", jwtAuth, CustomFieldController.toggleHide);

module.exports = router;