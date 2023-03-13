// Helpers
const StaffHelper       = require("../Services/StaffHelper");
const UserHelper        = require("../Services/UserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");
const MailHelper        = require("../Services/MailHelper");
const DesignationHelper = require("../Services/DesignationHelper");
const TokenHelper       = require("../Services/TokenHelper");
const TaskHelper        = require("../Services/TaskHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");
const UserActivityHelper= require("../Services/UserActivityHelper");


// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();
    let result;

    if(!request.pageNo)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    if(authUser.role == Role.ADMIN || authUser.role == Role.STAFF )
    {
        result = await StaffHelper.listStaff(authUser.firmId, request.pageNo, authUser.userId, request.designations, request.searchValue);
    }
    else
    {
        let projectIds = await ProjectUserHelper.foundProjectIdsByParticipant(authUser.userId); 
        let projectUserIds = await ProjectUserHelper.foundParticipantIdsByProjectIds(projectIds);
        let staffUserIds = await UserHelper.filterStaff(projectUserIds);
        result = await StaffHelper.listStaff(authUser.firmId, request.pageNo, authUser.userId, request.designations, request.searchValue, staffUserIds);
    }

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.listAll = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let result = await StaffHelper.listStaffAll(authUser.firmId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firstName || !request.lastName || !request.email || !request.designation)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let modelUser = await UserHelper.foundUserByEmail(request.email);
    if(modelUser!=null)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.EMAIL_EXIST);
        return res.status(response.code).json(response);
    }
    let firstTimeToken = await TokenHelper.tokenCreater(request.email);
    let password = await GeneralHelper.randomPasswordMaker();
    let staff = await StaffHelper.addStaff(request.firstName, request.lastName, request.specialization, request.designation, request.phoneNumber, authUser.firmId, request.email, password, firstTimeToken);
    let designation = await DesignationHelper.foundDesignationById(request.designation);
    
    const replacements = {
        email       : staff.email,
        link        : GeneralHelper.genertatePasswordSetLink(staff._id, firstTimeToken),
        appName     : process.env.APP_NAME,
        assetsPath  : GeneralHelper.getBackAppUrl(),
        designation : designation.title
    };
    await MailHelper.sendNewStaffEmail(request.email,replacements);

    // Log Activity Start
    UserActivityHelper.activityNewStaff(authUser.userId, authUser.firmId, `${staff.firstName} ${staff.lastName}`, staff.designation);
    // Log Activity End

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.update = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.firstName || !request.lastName || !request.designation || !request.id)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let staff = await UserHelper.updateUser({_id:request.id},{"detail.firstName":request.firstName, "detail.lastName":request.lastName, "detail.specialization":request.specialization, "designation":request.designation, "detail.phoneNumber":request.phoneNumber});

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};


exports.delete = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.staffs)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await StaffHelper.deleteStaff(request.staffs);

    // Log Activity Start
    UserActivityHelper.activityStaffDelete(authUser.userId, authUser.firmId, request.staffs);
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
    var user = await UserHelper.foundUserById(request.id);
    var projectIds = await ProjectUserHelper.foundProjectIdsByUser(user._id);
    let result = {
        "info": await StaffHelper.completeInfo(request.id),
        "totalProjects": (await ProjectUserHelper.foundProjectIdsByUser(request.id)).length,
        "pendingTasks": (await TaskHelper.userPendingTasks(request.id)).length,
        "completedTasks": (await TaskHelper.userCompletedTasks(request.id)).length,
        "activities": (await UserActivityHelper.listRecentUserActivity(user.firm, user._id, projectIds)),
    };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.bandwidth = async (req, res, next) => {

    let request = req.body;
    let firmId = req.user.firmId;
    let response = ResponseHelper.getDefaultResponse();

    let result = await StaffHelper.staffBandwidth(firmId,request.searchValue);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};