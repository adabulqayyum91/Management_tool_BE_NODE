// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const ManageFieldController = require('../Controllers/ManageFieldController');


// Routes
router.post("/list", jwtAuth, ManageFieldController.list);
router.post("/update", jwtAuth, ManageFieldController.update);


module.exports = router;