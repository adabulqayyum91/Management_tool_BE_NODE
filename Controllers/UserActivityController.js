// Helpers
const ResponseHelper = require("../Services/ResponseHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();
    let result;

    if(!request.pageNo || !request.filter)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    if(user.role == Role.ADMIN){
        result = await UserActivityHelper.listUserActivity(user.firmId, request.pageNo, request.filter, request.startDate, request.endDate);
    }
    else if(user.role == Role.STAFF){
        let projectIds = await ProjectUserHelper.foundProjectIdsByUser(user.userId);
        result = await UserActivityHelper.listUserActivity(user.firmId, request.pageNo, request.filter, request.startDate, request.endDate, user.userId, projectIds);
    }
    else{
        result = await UserActivityHelper.listUserActivity(user.firmId, request.pageNo, request.filter, request.startDate, request.endDate, user.userId);
    }


    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.listRecentActivity = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();
    let result;

    if(user.role == Role.ADMIN){
        result = await UserActivityHelper.listRecentUserActivity(user.firmId);
    }
    else if(user.role == Role.STAFF){
        let projectIds = await ProjectUserHelper.foundProjectIdsByUser(user.userId);
        result = await UserActivityHelper.listRecentUserActivity(user.firmId, user.userId, projectIds);
    }
    else{
        result = await UserActivityHelper.listRecentUserActivity(user.firmId, user.userId);
    }

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};