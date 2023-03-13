// Helpers
const ClientHelper      = require("../Services/ClientHelper");
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const MailHelper        = require("../Services/MailHelper");
const TokenHelper       = require("../Services/TokenHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");
const TaskHelper        = require("../Services/TaskHelper");
const UserActivityHelper= require("../Services/UserActivityHelper");


// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.pageNo)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await ClientHelper.listClient(authUser.firmId, request.pageNo, request.searchValue);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firstName || !request.lastName || !request.email || !request.phoneNumber)
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

    let firstTimeToken = await TokenHelper.tokenCreater(request.email);
    let password = await GeneralHelper.randomPasswordMaker();
    let client = await ClientHelper.addClient(request.firstName, request.lastName, request.address, request.phoneNumber, authUser.firmId, request.email, password, firstTimeToken);
    
    const replacements = {
        email       : client.email,
        link        : GeneralHelper.genertatePasswordSetLink(client._id, firstTimeToken),
        appName     : process.env.APP_NAME,
        assetsPath  : GeneralHelper.getBackAppUrl(),
    };
    await MailHelper.sendNewClientEmail(client.email,replacements);

    // Log Activity Start
    UserActivityHelper.activityNewClient(authUser.userId, authUser.firmId, `${client.detail.firstName} ${client.detail.lastName}`);
    // Log Activity End

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.update = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firstName || !request.lastName || !request.phoneNumber || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let client = await UserHelper.updateUser({_id:request.id},{"detail.firstName":request.firstName, "detail.lastName":request.lastName, "detail.address":request.address, "detail.phoneNumber":request.phoneNumber});
    
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};


exports.delete = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.clients)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await ClientHelper.deleteClient(request.clients);

    // Log Activity Start
    UserActivityHelper.activityClientDelete(authUser.userId, authUser.firmId, request.clients);
    // Log Activity End

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};


exports.counters = async (req, res, next) => {

    let request = req.params;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    
    let result = {
                    "totalProjects" : (await ProjectUserHelper.foundProjectIdsByUser(request.id)).length,
                    "pendingTasks" : (await TaskHelper.userPendingTasks(request.id)).length,
                    "completedTasks" : (await TaskHelper.userCompletedTasks(request.id)).length,
                };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};


exports.fullProfile = async (req, res, next) => {

    let request = req.params;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let user = await UserHelper.foundUserById(request.id);
    let result = {
        "info": await ClientHelper.completeInfo(request.id),
        "totalProjects": (await ProjectUserHelper.foundProjectIdsByUser(request.id)).length,
        "pendingTasks": (await TaskHelper.userPendingTasks(request.id)).length,
        "completedTasks": (await TaskHelper.userCompletedTasks(request.id)).length,
        "activities": (await UserActivityHelper.listRecentUserActivity(user.firm, user._id)),
    };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};