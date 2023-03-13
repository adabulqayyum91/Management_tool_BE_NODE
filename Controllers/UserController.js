// Helpers
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const MailHelper        = require("../Services/MailHelper");
const DesignationHelper = require("../Services/DesignationHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.listAvailableClientStaffInGroups = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let result = await UserHelper.listAvailableClientStaffInGroups(user.firmId, user.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.listAvailableClientStaff = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let result = await UserHelper.listAvailableClientStaff(user.firmId, user.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result.map((i) => {
        if(i.detail.firstName) {
            i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        }
        if(i.detail.name){
            i.detail.fullName = i.detail.name;
        }
        return i;
    }));
    return res.status(response.code).json(response);
};


