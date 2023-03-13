// Express Router
const express = require("express");
const router = express.Router();

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const CommentController = require('../Controllers/CommentController');


// Routes
router.post("/list", jwtAuth, CommentController.list);
router.post("/add", jwtAuth, CommentController.add);
router.post("/edit", jwtAuth, CommentController.updateComment);
router.post("/delete", jwtAuth, CommentController.deleteComment);

module.exports = router;