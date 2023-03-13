// Helpers
const ResponseHelper = require("../Services/ResponseHelper");
const GeneralHelper = require("../Services/GeneralHelper");
const GroupThreadHelper = require("../Services/GroupThreadHelper");
const UserActivityHelper = require("../Services/UserActivityHelper");

// Constants
const Message = require("../Constants/Message.js");
const ResponseCode = require("../Constants/ResponseCode.js");
const { log } = require("nodemon/lib/utils");


exports.createGroup = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;

    if (!request.users) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let imageName = request.threadImage;

    let users = request.users;
    let chatType = 'Multiple';
    let result = null;
    let checkUserChatFlag = 0; // 0 = create chat, 1 =  check one to one chat , 2 = return old chat thread
    if (typeof users == 'string')
        users = JSON.parse(users);
    if (users.length == 1) {
        chatType = 'Single'
        checkUserChatFlag = 1
    }
    if (checkUserChatFlag) {
        checkUserChatFlag = await GroupThreadHelper.checkUserOneToOneChat(authUser.userId, users);
    }
    if (checkUserChatFlag === 0) {
        users.push(authUser.userId)
        result = await GroupThreadHelper.createGroupThread(request.title, authUser.userId, users, imageName, chatType, request.project);
    } else {
        result = checkUserChatFlag;
    }
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
    return res.status(response.code).json(response);
}

exports.listGroupThread = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;

    var thread = await GroupThreadHelper.groupThreadListByUserId(authUser.userId)
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, thread);
    return res.status(response.code).json(response);
}
exports.addPerson = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;

    if (!request.threadId || !request.userId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let threadDetail = await GroupThreadHelper.foundGroupThreadById(request.threadId)
    if (threadDetail.users[0] != authUser.userId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.INVALID_USER, thread);
        return res.status(response.code).json(response);
    }
    if (threadDetail.users[0] == authUser.userId) {
        await GroupThreadHelper.addPersonToGroup(request.threadId, request.userId)
        var thread = await GroupThreadHelper.groupThreadList(request.threadId)
        response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, thread);
        return res.status(response.code).json(response);
    }
}

exports.deletePerson = async (req, res, next) => {

    let response = ResponseHelper.getDefaultResponse();
    let request = req.body;
    let authUser = req.user;

    if (!request.threadId || !request.userId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let threadDetail = await GroupThreadHelper.foundGroupThreadById(request.threadId)
    if (threadDetail.users[0] != authUser.userId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.INVALID_USER, thread);
        return res.status(response.code).json(response);
    }
    if (threadDetail.users[0] == authUser.userId) {
        await GroupThreadHelper.deletePersonToGroup(request.threadId, request.userId)
        var thread = await GroupThreadHelper.groupThreadList(request.threadId)
        response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, thread);
        return res.status(response.code).json(response);
    }
}