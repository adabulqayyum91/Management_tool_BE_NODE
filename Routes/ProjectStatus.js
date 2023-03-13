//Express Router
const express=require('express');
const router=express.Router();

//Middleswares

const jwtAuth=require('../Middleware/JWTAuth');
const roleAuth=require('../Middleware/JWTAuth');

//Controllers
const ProjectStatusController = require("../Controllers/ProjectStatusController.js");
 
//Routes
router.get("/list", jwtAuth, ProjectStatusController.list);
router.post("/add", jwtAuth, ProjectStatusController.add);
router.post("/update", jwtAuth, ProjectStatusController.update);
router.post("/delete", jwtAuth, ProjectStatusController.delete);
router.post("/toggleHide", jwtAuth, ProjectStatusController.toggleHide);

module.exports=router;