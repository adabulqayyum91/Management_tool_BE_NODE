// Helpers
const StaffHelper       = require("../Services/StaffHelper");
const ClientHelper      = require("../Services/ClientHelper");
const FirmHelper   	    = require("../Services/FirmHelper");
const TaskHelper        = require("../Services/TaskHelper");
const ProjectHelper     = require("../Services/ProjectHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role 	    		= require("../Constants/Role.js");
const MessageHelper = require("../Services/MessageHelper");

exports.superAdminCounters = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let result = {
                    "newRegisterations" : await FirmHelper.newRegisterations(),
                    "totalRegistered" : await FirmHelper.totalRegistered(),
                    "registeredThisMonth" : await FirmHelper.registeredThisMonth(),
                    "registeredThisYear" : await FirmHelper.registeredThisYear(),
                };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.admin = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let firmId = req.user.firmId;

    let result = {
                    "registeredClients" : await ClientHelper.totalRegistered(firmId),
                    "registeredStaff" : await StaffHelper.totalRegistered(firmId),
                    "registeredUser" : await StaffHelper.totalRegistered(firmId) + await ClientHelper.totalRegistered(firmId),
                    "totalProject" : await ProjectHelper.totalProjects(firmId),
                };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.staff = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = {
                    "total_messages" : await MessageHelper.userMessagesCounter(authUser.userId),
                    "total_projects" : (await ProjectUserHelper.foundProjectIdsByUser(authUser.userId)).length,
                    "pending_tasks" : (await TaskHelper.userPendingTasks(authUser.userId)).length,
                    "completed_tasks" : (await TaskHelper.userCompletedTasks(authUser.userId)).length,
                };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.client = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let authUser = req.user;

    let result = {
                    "total_messages" : await MessageHelper.userMessagesCounter(authUser.userId),
                    "total_projects" : (await ProjectUserHelper.foundProjectIdsByUser(authUser.userId)).length,
                    "pending_tasks" : (await TaskHelper.userPendingTasks(authUser.userId)).length,
                    "completed_tasks" : (await TaskHelper.userCompletedTasks(authUser.userId)).length,
                };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};