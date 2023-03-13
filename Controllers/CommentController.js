// Helpers
const ResponseHelper 	= require("../Services/ResponseHelper");
const ProjectHelper 	= require("../Services/ProjectHelper");
const GeneralHelper 	= require("../Services/GeneralHelper");
const CommentHelper     = require("../Services/CommentHelper");
const UserActivityHelper= require("../Services/UserActivityHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 		= require("../Constants/ResponseCode.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.projectId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await CommentHelper.listCommnets(request.projectId, false);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.add = async (req, res, next) => {
	
	let response = ResponseHelper.getDefaultResponse();
	let request = req.body;
	let authUser = req.user;

    let foundProject = await ProjectHelper.foundProjectById(request.projectId);
	if (foundProject==null) {
		response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.PROJECT_NOT_EXIST);
    	return res.status(response.code).json(response);
    }
    if(!request.projectId || !request.text)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

	let result = await CommentHelper.addComment(authUser.userId, request.text, request.projectId);
    CommentHelper.sendCommentEmail(authUser.userId, foundProject.title, foundProject._id, request.text)

    // Log Activity Start
    UserActivityHelper.activityNewComment(authUser.userId, authUser.firmId, request.projectId, request.text);
    // Log Activity End

	response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL, result);
	return res.status(response.code).json(response);
}

//update comment
exports.updateComment = async (req, res, next) => {
	
	let response = ResponseHelper.getDefaultResponse();
	let request = req.body;
	let authUser = req.user;

    if(!request.commentId || !request.text)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let result = await CommentHelper.updateComment(request.commentId, request.text);
    if(!result){
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.NO_COMMENT_FOUND);
    	return res.status(response.code).json(response);
    }
    let foundProject = await ProjectHelper.foundProjectById(result.project);

    CommentHelper.sendUpdateCommentEmail(authUser.userId, foundProject.title, foundProject._id, request.text,"UPDATE")

    // Log Activity Start
    UserActivityHelper.activityUpdateComment(authUser.userId, authUser.firmId, foundProject._id, request.text);
    // Log Activity End

	response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL, result);
	return res.status(response.code).json(response);
}

//delete comment
exports.deleteComment = async (req, res, next) => {
	
	let response = ResponseHelper.getDefaultResponse();
	let request = req.body;
	let authUser = req.user;

    if(!request.commentId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let result = await CommentHelper.deleteComment(request.commentId);
    if(!result){
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.NO_COMMENT_FOUND);
    	return res.status(response.code).json(response);
    }
    let foundProject = await ProjectHelper.foundProjectById(result.project);

    CommentHelper.sendUpdateCommentEmail(authUser.userId, foundProject.title, foundProject._id, result.text,"DELETE")

    // Log Activity Start
    UserActivityHelper.activityDeleteComment(authUser.userId, authUser.firmId, foundProject._id, result.text);
    // Log Activity End

	response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL, result);
	return res.status(response.code).json(response);
}