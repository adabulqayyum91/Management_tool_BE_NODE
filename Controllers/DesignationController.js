// Helpers
const DesignationHelper = require("../Services/DesignationHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const StaffHelper       = require("../Services/StaffHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = await DesignationHelper.listDesignations(authUser.firmId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    if(!request.title)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelDesignation = await DesignationHelper.foundDesignationByTitle(request.title,authUser.firmId);
    if(!(modelDesignation==null))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }
    let designation = await DesignationHelper.addDesignation(request.title, authUser.firmId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.update = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    if(!request.title || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let designationByTitle = await DesignationHelper.foundDesignationByTitle(request.title, authUser.firmId);
    if(designationByTitle!=null && designationByTitle._id != request.id )
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    let designation = await DesignationHelper.updateDesignation({_id:request.id},{title:request.title});
    
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

    let staffCount = await StaffHelper.foundStaffCount({designation:request.id, isDeleted:false});
    if(staffCount)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.STAFF_ATTACHED);
        return res.status(response.code).json(response);
    }

    let result = await DesignationHelper.deleteDesignation(request.id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};