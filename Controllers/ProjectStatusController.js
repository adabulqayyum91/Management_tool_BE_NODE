// Helpers
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const ProjectHelper     = require("../Services/ProjectHelper");
const ProjectStatusHelper = require("../Services/ProjectStatusHelper");

// Constants
const Message       = require("../Constants/Message.js");
const ResponseCode  = require("../Constants/ResponseCode.js");

exports.list = async (req,res,next)=>{
    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = await ProjectStatusHelper.listProjectStatus(authUser.firmId);
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response); 
};

exports.add = async (req,res,next)=>{
    
    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;
    
    if(!request.title)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelProjectStatus = await ProjectStatusHelper.foundProjectStatusByTitle(request.title,authUser.firmId);
    if(modelProjectStatus!=null)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    let projectstatus = await ProjectStatusHelper.addProjectStatus(request.title,authUser.firmId);
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.update= async (req,res,next)=>{

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser =  req.user;
    
    if(!request.title || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectStatusByTitle = await ProjectStatusHelper.foundProjectStatusByTitle(request.title, authUser.firmId);
    
    if((projectStatusByTitle!= null) && (projectStatusByTitle._id != request.id ))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    let projectStatus = await ProjectStatusHelper.updateProjectStatus({_id:request.id},{title:request.title});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.delete = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectCount = await ProjectHelper.foundProjectCount({status:request.id, isDeleted:false});
    if(projectCount)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.PROJECT_ATTACHED_TO_STATUS);
        return res.status(response.code).json(response);
    }

    let result = await ProjectStatusHelper.deleteProjectStatus(request.id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

// hide projectStatus

exports.toggleHide= async (req,res,next)=>{

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser =  req.user;
    let projectStatus = await ProjectStatusHelper.updateProjectHideStatus({firm:authUser.firmId},{hide:request.hide});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};