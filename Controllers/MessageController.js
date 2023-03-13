// Helpers
const ResponseHelper = require("../Services/ResponseHelper");
const GeneralHelper = require("../Services/GeneralHelper");
const MessageHelper = require("../Services/MessageHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");

// Constants
const Message 			= require("../Constants/Message.js");
const ResponseCode 		= require("../Constants/ResponseCode.js");


exports.list = async (req, res, next) => {

    let request = req.params;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    if(!request.threadId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await MessageHelper.listMessages(request.threadId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.create = async (req, res, next) => {

    let request = req.body;
  //  console.log("request : ",request)
    let authUser = req.user;
   // console.log("Auth User: ",authUser)
    let response = ResponseHelper.getDefaultResponse();

    if(!request.threadId)
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }

    let result = await MessageHelper.createMessage(authUser.userId, request.threadId, request.text, request.attachment);
    // console.log(result.createdAt)

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};

exports.uploadFile = async (req, res, next) => {
    
    let response = ResponseHelper.getDefaultResponse();

    let fileName = GeneralHelper.makeImagePath(process.env.MEDIA_DIR,req.file.filename);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.FILE_UPLOAD_SUCCESS,fileName);
    res.status(response.code).json(response);
};