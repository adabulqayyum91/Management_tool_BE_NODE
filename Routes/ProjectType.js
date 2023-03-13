//Express Router
const express=require('express');
const router=express.Router();

//Middleswares

const jwtAuth=require('../Middleware/JWTAuth');
const roleAuth=require('../Middleware/JWTAuth');

//Controllers
const ProjectTypeController = require("../Controllers/ProjectTypeController.js");
 
//Routes
router.get("/list", jwtAuth, ProjectTypeController.list);
router.post("/add", jwtAuth, ProjectTypeController.add);
router.post("/update", jwtAuth, ProjectTypeController.update);
router.post("/delete", jwtAuth, ProjectTypeController.delete);
router.post("/toggleHide", jwtAuth, ProjectTypeController.toggleHide);

module.exports=router;