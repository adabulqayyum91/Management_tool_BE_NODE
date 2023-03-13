// Helpers
const TaskHelper = require("../Services/TaskHelper");
const SubTaskHelper = require("../Services/SubTaskHelper");
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

    if (!request.taskId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await SubTaskHelper.listTasks(request.taskId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.title || !request.projectId || !request.userId || !request.estimatedTime == undefined || !request.meetingView == undefined || !request.dueDate  || !request.taskId) {
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
    let subTask = await SubTaskHelper.addTask(request.title,request.projectId, request.userId, request.estimatedTime, request.dueDate, request.matterView, request.meetingView || !request.taskId);
    let task = await TaskHelper.foundTaskById(request.taskId);    
    task.subTasks.push(subTask._id)
    await task.save();
    UserActivityHelper.activitySubTaskCreate(user.userId, user.firmId, task._id, task.title, request.title);

    if(user.userId != request.userId)
        TaskHelper.sendTaskEmail(user.userId, task.title, request.title, request.userId, request.dueDate,request.projectId)

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
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

    await SubTaskHelper.updateTask({ _id: request.taskId }, { status: request.status, completedDate: request.completedDate });

    let task = await SubTaskHelper.foundTaskById(request.taskId);
    UserActivityHelper.activityTaskStatusChange(user.userId, user.firmId, task.project, task.title, request.status);

    if(request.status)
        SubTaskHelper.taskStatusUpdateEmail(user.userId, task.title, request.status, task.project);
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
        i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        return i;
    }));
    return res.status(response.code).json(response);
};

exports.deleteSubtask = async (req, res, next) => {

    let request = req.body;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.subTaskId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await SubTaskHelper.deleteTask(request.subTaskId);

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

    let result = await SubTaskHelper.updateCompeteTask(request);
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);

}
