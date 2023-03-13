// Helpers
const ProjectHelper = require("../Services/ProjectHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");
const ResponseHelper = require("../Services/ResponseHelper");
const GeneralHelper = require("../Services/GeneralHelper");
const UserHelper = require("../Services/UserHelper");
const TaskHelper = require("../Services/TaskHelper");
const FileHelper = require("../Services/FileHelper");
const CommentHelper = require("../Services/CommentHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");

// Constants
const Message = require("../Constants/Message.js");
const ResponseCode = require("../Constants/ResponseCode.js");
const Role = require("../Constants/Role.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();
    let taskStatus = request.taskStatus
    let result;

    if (!request.pageNo) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    if (authUser.role == Role.ADMIN || request.meetingView === true)
        result = await ProjectHelper.listFirmProjectsWithFilters(authUser.firmId, request.pageNo, request.statuses, request.types, request.users, request.searchValue, request.customFieldOptions, request.meetingView, request.customFieldOptions2);
    else if (authUser.role == Role.STAFF)
        result = await ProjectHelper.listOwnProjectsWithFilters(authUser.firmId, request.pageNo, request.statuses, request.types, request.users, request.myProject, authUser.userId, request.searchValue, request.customFieldOptions, request.customFieldOptions2);
    else
        result = await ProjectHelper.listOwnProjectsWithFilters(authUser.firmId, request.pageNo, request.statuses, request.types, request.users, true, authUser.userId, request.searchValue, request.customFieldOptions, request.customFieldOptions2);

    if (result && result.data && result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
            let task = [];

            task = await TaskHelper.listCustomMyTasks(result.data[i].details['_id'], authUser.userId, request.meetingView, taskStatus);

            if (task) {
                result.data[i]['tasks'] = task
            }
        }
    }
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.listOwnProjects = async (req, res, next) => {

    let request = req.body;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();

    let result = await ProjectHelper.listOwnProjects(userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.listFirmProjects = async (req, res, next) => {

    let request = req.body;
    let firmId = req.user.firmId;
    let response = ResponseHelper.getDefaultResponse();

    let result = await ProjectHelper.listFirmProjects(firmId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.title) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // let modelProject = await ProjectHelper.foundProjectByTitle(request.title, authUser.firmId);
    // if (!(modelProject == null)) {
    //     response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
    //     return res.status(response.code).json(response);
    // }

    let project = await ProjectHelper.addProject(request.title, request.type, request.status, request.privacy, authUser.firmId, request.description, request.customFieldOption, request.customFieldOption2, request.company, request.project);
    let projectUsers = await ProjectHelper.addProjectUser(authUser.userId, project._id, request.users);
    ProjectHelper.sendEmailToCollaborators(authUser.userId, project._id, project.title, request.users);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateStatus = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId || !request.status) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectStatusChange(user.userId, user.firmId, project._id, project.title, project.status._id, request.status);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { status: request.status });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateCustomFieldOption = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId || !request.customFieldOption || !request.type) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    if (request.type == "option1")
        await ProjectHelper.updateProject({ _id: request.projectId }, { customFieldOption: request.customFieldOption });
    else
        await ProjectHelper.updateProject({ _id: request.projectId }, { customFieldOption2: request.customFieldOption });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateType = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId || !request.type) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectTypeChange(user.userId, user.firmId, project._id, project.title, project.type._id, request.type);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { type: request.type });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updatePrivacy = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId || !request.privacy) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectPrivacyChange(user.userId, user.firmId, project._id, project.title, request.privacy);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { privacy: request.privacy });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateTitle = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId || !request.title) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectByTitle = await ProjectHelper.foundProjectByTitle(request.title, request.firmId);
    if (projectByTitle != null && projectByTitle._id != request.id) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.ALREADY_EXIST);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectTitleChange(user.userId, user.firmId, project._id, project.title, request.title);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { title: request.title });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};
exports.updateDescription = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.projectId || !request.description) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    //TODO add this method in future
    // UserActivityHelper.activityProjectDescriptionChange(user.userId, user.firmId, project._id, project.description, request.description);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { description: request.description });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateCompany = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.projectId || !request.company) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectCompanyChange(user.userId, user.firmId, project._id, project.company, request.company);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { company: request.company });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.updateProjectField = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();
    if (!request.projectId || !request.project) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.projectId);
    UserActivityHelper.activityProjectProjectChange(user.userId, user.firmId, project._id, project.project, request.project);
    // Log Activity End

    await ProjectHelper.updateProject({ _id: request.projectId }, { project: request.project });

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.delete = async (req, res, next) => {

    let request = req.body;
    let user = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.id) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectOwner = await ProjectUserHelper.foundProjectOwner(request.id);
    if (projectOwner.user != user.userId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.PERMISSION_DENIED);
        return res.status(response.code).json(response);
    }

    // Log Activity Start
    let project = await ProjectHelper.foundProjectById(request.id);
    UserActivityHelper.activityProjectDelete(user.userId, user.firmId, project._id, project.title);
    // Log Activity End

    let result = await ProjectHelper.deleteProject(request.id);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};


exports.detail = async (req, res, next) => {

    let request = req.params;
    let userId = req.user.userId;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.projectId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let projectOwner = await ProjectUserHelper.foundProjectOwner(request.projectId);
    let result = {
        "project": await ProjectHelper.foundProjectById(request.projectId),
        "projectOwner": await UserHelper.foundUserById(projectOwner.user),
        "projectParticipants": await ProjectUserHelper.listProjectParticipants(request.projectId),
        "projectTasks": await TaskHelper.listTasks(request.projectId),
        "attachments": await FileHelper.listProjectFiles(request.projectId, false),
        "comments": await CommentHelper.listCommnets(request.projectId, false)
    };

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.recentProjects = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let result;

    result = await ProjectHelper.getRecentProjects(request.firmId, authUser.userId);
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);

};