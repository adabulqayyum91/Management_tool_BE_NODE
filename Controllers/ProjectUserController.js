// Helpers
const ProjectHelper     = require("../Services/ProjectHelper");
const ProjectUserHelper = require("../Services/ProjectUserHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ProjectUserType   = require("../Constants/ProjectUserType.js");
const ResponseCode 	    = require("../Constants/ResponseCode.js");


exports.listParticipant = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.projectId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    
    let result = await ProjectUserHelper.listProjectParticipants(request.projectId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result.map((i) => {
        i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        return i;
    }));
    return res.status(response.code).json(response);
};

exports.listAvailableParticipant = async (req, res, next) => {

    let request = req.body;
    let firmId = req.user.firmId;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.projectId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    
    let result = await ProjectUserHelper.listAvailableParticipants(request.projectId, firmId);

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


exports.addParticipant = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    let result;

    if(!request.projectId || !request.users)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    
    let users = request.users;

    let project = await ProjectHelper.foundProjectById(request.projectId);
    let projectOwner = await ProjectUserHelper.foundProjectOwner(request.projectId);

    for(i=0; i<users.length; i++)
    {
        let projectUser = await ProjectUserHelper.foundProjectUser(request.projectId, users[i]);
        if(projectUser==null)
        {
            result = await ProjectUserHelper.addUser(users[i], request.projectId, ProjectUserType.PARTICIPANT);
            ProjectHelper.sendEmailToCollaborators(projectOwner.user, project._id, project.title, request.users);
        }
    }

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};

exports.deleteParticipant = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.projectId || !request.userId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    
    let result = await ProjectUserHelper.deleteParticipant(request.userId, request.projectId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL);
    return res.status(response.code).json(response);
};