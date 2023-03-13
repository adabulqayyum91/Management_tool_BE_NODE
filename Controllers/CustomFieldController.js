// Helpers
const CustomFieldHelper = require("../Services/CustomFieldHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const ProjectHelper       = require("../Services/ProjectHelper");



// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.updateLabel = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    if(!request.title || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    await CustomFieldHelper.updateCustomField({_id:request.id},{title:request.title});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.getWithOptions = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = await CustomFieldHelper.getCustomFieldWithOptions(authUser.firmId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.addOption = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    if(!request.title || !request.customField)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelCustomFieldOption = await CustomFieldHelper.foundCustomFieldOptionByTitle(request.title,authUser.firmId, request.customField);
    if(!(modelCustomFieldOption==null))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }
    let newOption = await CustomFieldHelper.addCustomFieldOption(request.title, authUser.firmId, request.customField);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, newOption);
    return res.status(response.code).json(response);
};

exports.updateOption = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    if(!request.title || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let customFieldOptionByTitle = await CustomFieldHelper.foundCustomFieldOptionByTitle(request.title, authUser.firmId, request.customField);
    if(customFieldOptionByTitle!=null && customFieldOptionByTitle._id != request.id )
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    await CustomFieldHelper.updateCustomFieldOption({_id:request.id},{title:request.title});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};


exports.deleteOption = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectCount = await ProjectHelper.foundProjectCount({customFieldOption:request.id, isDeleted:false});
    if(projectCount)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.PROJECT_ATTACHED_TO_TYPE);
        return res.status(response.code).json(response);
    }

    let result = await CustomFieldHelper.deleteCustomFieldOption(request.id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

// hide projectStatus

exports.toggleHide= async (req,res,next)=>{

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let projectStatus = await CustomFieldHelper.updateProjectHideStatus(request._id,{hide:request.hide});
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
}