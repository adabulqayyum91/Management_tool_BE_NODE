// Helpers
const ResponseHelper 	= require("../Services/ResponseHelper");
const ProjectHelper 	= require("../Services/ProjectHelper");
const GeneralHelper 	= require("../Services/GeneralHelper");
const FileHelper 		= require("../Services/FileHelper");
const UserActivityHelper= require("../Services/UserActivityHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 		= require("../Constants/ResponseCode.js");
const Role              = require("../Constants/Role.js");


exports.listFiles = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();
    let result;

    if(!request.pageNo)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }


    if(authUser.role == Role.ADMIN)
        result = await FileHelper.listFrimFiles(authUser.firmId, request.pageNo, request.projects, request.users, request.createdAt, request.searchValue);
    else
        result = await FileHelper.listMyFiles(authUser.firmId, request.pageNo, authUser.userId, request.projects, request.users, request.createdAt, request.searchValue);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};


exports.listProjectFiles = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.projectId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await FileHelper.listProjectFiles(request.projectId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.addProjectFile = async (req, res, next) => {
	
	let response = ResponseHelper.getDefaultResponse();
	let request = req.body;
	let user 	= req.user;
    let firmId  = req.user.firmId;

    let foundProject = await ProjectHelper.foundProjectById(request.projectId);
	if (foundProject==null) {
		response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.PROJECT_NOT_EXIST);
    	return res.status(response.code).json(response);
    }

    if(!request.projectId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

	let fileName = GeneralHelper.makeFilePath(process.env.MEDIA_DIR, req.file.filename);

	let result = await FileHelper.addFile(user.userId, fileName, firmId, request.projectId);

    // Log Activity Start
    UserActivityHelper.activityFileAdd(user.userId, user.firmId, request.projectId);
    // Log Activity End

	response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.ATTACHMENT_UPLOAD_SUCCESS, fileName);
	return res.status(response.code).json(response);
}

exports.addFile = async (req, res, next) => {
    
    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let user  = req.user;

    let fileName = GeneralHelper.makeFilePath(process.env.MEDIA_DIR, req.file.filename);

    let result = await FileHelper.addFile(user.userId, fileName, user.firmId);

    // Log Activity Start
    UserActivityHelper.activityFileAdd(user.userId, user.firmId);
    // Log Activity End

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.ATTACHMENT_UPLOAD_SUCCESS, fileName);
    return res.status(response.code).json(response);
}


exports.delete = async (req, res, next) => {
	
	let response = ResponseHelper.getDefaultResponse();
	let request = req.body;

    if(!request.attachmentId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await FileHelper.deleteFile(request.attachmentId);

	response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.ATTACHMENT_REMOVED_SUCCESS);
	res.status(response.code).json(response);
};