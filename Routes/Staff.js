// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const StaffController = require('../Controllers/StaffController');


// Routes
router.post("/list", jwtAuth, StaffController.list);
router.get("/list-all", jwtAuth, StaffController.listAll);
router.post("/add", jwtAuth, StaffController.add);
router.post("/update", jwtAuth, StaffController.update);
router.post("/delete", jwtAuth, StaffController.delete);
router.get("/counters/:id", jwtAuth, StaffController.counters);
router.get("/full-profile/:id", jwtAuth, StaffController.fullProfile);
router.post("/bandwidth", jwtAuth, StaffController.bandwidth);


module.exports = router;