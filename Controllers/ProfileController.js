// Helpers
const AdminHelper       = require("../Services/AdminHelper");
const FirmHelper        = require("../Services/FirmHelper");
const StaffHelper       = require("../Services/StaffHelper");
const ClientHelper      = require("../Services/ClientHelper");
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");


exports.adminUpdate = async (req, res, next) => {

    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firmName || !request.adminName || !request.phoneNumber)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelFirm = await FirmHelper.foundFirm({name:request.firmName});
    if(modelFirm!=null && modelFirm._id != user.firmId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.FRIM_EXIST);
        return res.status(response.code).json(response);
    }
    
    let frim = await FirmHelper.updateFirm({_id:user.firmId}, {name:request.firmName, licenseNumber:request.licenseNumber});
    let admin = await UserHelper.updateUser({_id:user.userId}, {"detail.name":request.adminName, "detail.phoneNumber":request.phoneNumber});

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.adminDetail = async (req, res, next) => {

    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let admin = await AdminHelper.profile(user.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, admin);
    return res.status(response.code).json(response);
};

exports.staffUpdate = async (req, res, next)=>{

    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();
    
    if(!request.firstName || !request.lastName || !request.phoneNumber || !request.specialization )
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let staff = await UserHelper.updateUser({_id:user.userId},{"detail.firstName": request.firstName, "detail.lastName": request.lastName, "detail.phoneNumber": request.phoneNumber, "detail.specialization": request.specialization});
    
    response  = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.staffDetail = async (req, res, next)=>{
    
    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let staff = await StaffHelper.profile(user.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, staff);
    return res.status(response.code).json(response);

};

exports.clientUpdate = async (req, res, next)=>{

    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();
    
    if(!request.firstName || !request.lastName || !request.phoneNumber )
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let client = await UserHelper.updateUser({_id:user.userId},{"detail.firstName": request.firstName, "detail.lastName": request.lastName, "detail.phoneNumber": request.phoneNumber, "detail.address": request.address});
    
    response  = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.clientDetail = async (req, res, next)=>{
    
    let request = req.body;
    let user    = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let client = await ClientHelper.profile(user.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, client);
    return res.status(response.code).json(response);

};