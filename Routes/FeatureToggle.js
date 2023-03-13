// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const FeatureToggle = require('../Controllers/FeatureToggle');


// Routes
router.get("/project-view/firm-id/:firmId", jwtAuth, FeatureToggle.getProjectView);
router.get("/project-view/add-firm-id/:firmId", jwtAuth, FeatureToggle.addInProjectView);


module.exports = router;