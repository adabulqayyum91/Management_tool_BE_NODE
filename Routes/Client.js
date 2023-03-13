// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const ClientController = require('../Controllers/ClientController');


// Routes
router.post("/list", jwtAuth, ClientController.list);
router.post("/add", jwtAuth, ClientController.add);
router.post("/update", jwtAuth, ClientController.update);
router.post("/delete", jwtAuth, ClientController.delete);
router.get("/counters/:id", jwtAuth, ClientController.counters);
router.get("/full-profile/:id", jwtAuth, ClientController.fullProfile);


module.exports = router;