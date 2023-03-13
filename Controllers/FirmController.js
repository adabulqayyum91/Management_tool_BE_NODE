// Helpers
const FirmHelper   	    = require("../Services/FirmHelper");
const UserHelper        = require("../Services/UserHelper");
const AdminHelper       = require("../Services/AdminHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const MailHelper        = require("../Services/MailHelper");
const CustomFieldHelper        = require("../Services/CustomFieldHelper");

// Constants
const Message       = require("../Constants/Message.js");
const ResponseCode  = require("../Constants/ResponseCode.js");
const FirmStatus    = require("../Constants/FirmStatus.js");
const Role          = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.status || !request.pageNo || request.isDeleted==undefined)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await FirmHelper.listFirms(request.status, request.isDeleted, request.pageNo, request.searchValue);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.register = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.companyName || !request.password || !request.email || !request.adminName || !request.phoneNumber)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelUser = await UserHelper.foundUserByEmail(request.email);
    if(!(modelUser==null))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.EMAIL_EXIST);
        return res.status(response.code).json(response);
    }

    let modelFirm = await FirmHelper.foundFirmByName(request.companyName);
    if(!(modelFirm==null))
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.FRIM_EXIST);
        return res.status(response.code).json(response);
    }
    
    let firm = await FirmHelper.registerFirm(request.companyName,request.licenseNumber);
    let password = await GeneralHelper.bcryptPassword(request.password);
    let admin = await FirmHelper.createAdmin(request.email,password,request.adminName,request.phoneNumber,firm._id);
    let designations = await FirmHelper.createDefaultDesignations(firm._id);
    CustomFieldHelper.getCustomFieldWithOptions(firm._id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateStatus = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id || !request.status || !request.note)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let firmStatus = await FirmHelper.updateFirmStatus(request.id,request.status,request.note);

    if(request.status == FirmStatus.APPROVED)
    {
        let user = await UserHelper.foundUserByFirmAndRole(request.id, Role.ADMIN);
        
        const replacements = {
            email       : user.email,
            adminName   : user.detail.name,
            link        : GeneralHelper.getFrontAppUrl(),
            appName     : process.env.APP_NAME,
            assetsPath  : GeneralHelper.getBackAppUrl()
        };
        await MailHelper.sendFirmApprovalEmail(user.email,replacements);
    }
    else
    {
        await FirmHelper.deleteFirms([request.id]);
    }

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, firmStatus);
    return res.status(response.code).json(response);
};


exports.updateNote = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id || !request.note)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let firm = await FirmHelper.updateFirm({_id:request.id},{note:request.note});

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, firm);
    return res.status(response.code).json(response);
};

exports.delete = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firms)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await FirmHelper.deleteFirms(request.firms);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};