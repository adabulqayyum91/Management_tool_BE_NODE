// Helpers
const TaskHelper = require("../Services/TaskHelper");
const ResponseHelper = require("../Services/ResponseHelper");
const GeneralHelper = require("../Services/GeneralHelper");
const ProjectHelper = require("../Services/ProjectHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");

// Constants
const Message = require("../Constants/Message.js");
const ResponseCode = require("../Constants/ResponseCode.js");
const Role = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await TaskHelper.listTasks(request.projectId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.title || !request.projectId || !request.userId || !request.estimatedTime == undefined || !request.meetingView == undefined || !request.dueDate) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    //Will uncomment this in future for unique task name
    // let modelTask = await TaskHelper.foundTaskByTitle(request.title,request.projectId);
    // if(!(modelTask==null))
    // {
    //     response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
    //     return res.status(response.code).json(response);
    // }
    let task = await TaskHelper.addTask(request.title, request.projectId, request.userId, request.estimatedTime, request.dueDate, request.matterView, request.meetingView);

    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityTaskCreate(user.userId, user.firmId, project._id, project.title, request.title);

    if(user.userId != request.userId)
        TaskHelper.sendTaskEmail(user.userId, project.title, request.title, request.userId, request.dueDate,request.projectId)

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.startTime = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.taskId || !request.startDate) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }


    let updateObj = {
        startDate: request.startDate,
        inProgress: true
    };

    if (request.userEstimatedTime != undefined) {
        updateObj['userEstimatedTime'] = request.userEstimatedTime;
    }

    await TaskHelper.updateTask({ _id: request.taskId }, updateObj);
    let task = await TaskHelper.foundTaskByIdWithUser(request.taskId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, task);
    return res.status(response.code).json(response);
};

exports.stopTime = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.taskId || !request.endDate) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let task = await TaskHelper.foundTaskById(request.taskId);

    let oldSpentTime = GeneralHelper.isValueSet(task.spentTime) ? task.spentTime : 0;

    // Code to Find Diff Between Start And End Date Time in minutes
    let dt1 = new Date(task.startDate);
    let dt2 = new Date(request.endDate);
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;

    // TODO: If difference needs to be converted in minutes
    // diff /= 60;

    let newSpentTime = Math.abs(Math.round(diff));
    ///////////////////////////////////////////////////////////////

    let spentTime = oldSpentTime + newSpentTime;
    await TaskHelper.updateTask({ _id: request.taskId }, { inProgress: false, spentTime: spentTime });
    task = await TaskHelper.foundTaskByIdWithUser(request.taskId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, task);
    return res.status(response.code).json(response);
};

exports.updateStatus = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.taskId || !request.status == undefined) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    if (request.status) {
        if (request.completedDate == null || request.completedDate == undefined) {
            response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
            return res.status(response.code).json(response);
        }
    }
    else {
        request.completedDate = null;
    }

    await TaskHelper.updateTask({ _id: request.taskId }, { status: request.status, completedDate: request.completedDate });

    let task = await TaskHelper.foundTaskById(request.taskId);
    UserActivityHelper.activityTaskStatusChange(user.userId, user.firmId, task.project, task.title, request.status);

    if(request.status)
        TaskHelper.taskStatusUpdateEmail(user.userId, task.title, request.status, task.project);
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.listAvailableParticipant = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await TaskHelper.listAvailableParticipants(request.projectId);
    console.log(result);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result.map((i) => {
        if (i.detail.firstName) {
            i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        }
        if (i.detail.name) {
            i.detail.fullName = i.detail.name;
        }
        return i;
    }));
    return res.status(response.code).json(response);
};

exports.delete = async (req, res, next) => {

    let request = req.body;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.taskId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await TaskHelper.deleteTask(request.taskId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};
exports.update = async (req, res, next) => {
    let request = req.body;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.taskId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await TaskHelper.updateCompeteTask(request);
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);

}
