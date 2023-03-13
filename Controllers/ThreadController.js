// Helpers
const ResponseHelper = require("../Services/ResponseHelper");
const GeneralHelper = require("../Services/GeneralHelper");
const ThreadHelper = require("../Services/ThreadHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");

// Constants
const Message = require("../Constants/Message.js");
const ResponseCode = require("../Constants/ResponseCode.js");


exports.list = async (req, res, next) => {

    let request = req.body;
    let authUser = req.user;
    let response = ResponseHelper.getDefaultResponse();

    let result = await ThreadHelper.listThreads(authUser.userId);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
};
exports.getOrCreate = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;
    if (!request.toUser) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    var thread = await ThreadHelper.getThread(authUser.userId, request.toUser, request.project);
    if (thread == null) {
        thread = await ThreadHelper.createThread(authUser.userId, request.toUser, request.project);
    }

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, thread);
    return res.status(response.code).json(response);
}
exports.createGroup = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;

    if (!request.users || !request.title) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let imageName = GeneralHelper.makeImagePath(process.env.MEDIA_DIR, req.file.filename);

    let users = request.users;
    if (typeof users == 'string')
        users = JSON.parse(users);

    var thread = await ThreadHelper.createGroupThread(request.title, users, imageName);
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, thread);
    return res.status(response.code).json(response);
}

