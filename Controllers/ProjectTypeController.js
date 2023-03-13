// Helpers
const ProjectTypeHelper = require("../Services/ProjectTypeHelper");
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const ProjectHelper     = require("../Services/ProjectHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");

exports.list = async (req,res,next)=>{

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = await ProjectTypeHelper.listProjectType(authUser.firmId);

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

    let modelProjectType= await ProjectTypeHelper.foundProjectTypeByTitle(request.title, authUser.firmId);
    if(modelProjectType!=null)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    let projecttype = await ProjectTypeHelper.addProjectType(request.title, authUser.firmId);
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, projecttype);
    return res.status(response.code).json(response);
};

exports.update= async (req,res,next)=>{
    
    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;
    
    if(!request.title || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectTypeByTitle = await ProjectTypeHelper.foundProjectTypeByTitle(request.title, authUser.firmId);
    if((projectTypeByTitle!= null) && (projectTypeByTitle._id != request.id ))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    let projectType = await ProjectTypeHelper.updateProjectType({_id:request.id},{title:request.title});
    
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

    let projectCount = await ProjectHelper.foundProjectCount({type:request.id, isDeleted:false});
    if(projectCount)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.PROJECT_ATTACHED_TO_TYPE);
        return res.status(response.code).json(response);
    }
    
    let result = await ProjectTypeHelper.deleteProjectType(request.id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
}

// hide projectStatus

exports.toggleHide= async (req,res,next)=>{

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser =  req.user;
    let projectStatus = await ProjectTypeHelper.updateProjectHideStatus({firm:authUser.firmId},{hide:request.hide});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
}