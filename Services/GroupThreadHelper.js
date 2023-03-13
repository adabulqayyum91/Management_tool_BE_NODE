// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');

// Models
const User = require("../Models/User");
const GroupThread = require("../Models/GroupThread");
const GroupThreadUser = require("../Models/GroupThreadUser");
let ObjectID = require('mongodb').ObjectID;


// Helpers
const GeneralHelper = require("./GeneralHelper");

exports.createGroupThread = async (title, userId, users, image = null, chatType, project) => {

    const groupThread = new GroupThread({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        image: image,
        chatType: chatType,
        project: project,
        createdBy: userId,
        users: users
    });
    await groupThread.save();
    return groupThread.populate("users", "profileImage detail.firstName detail.lastName detail.name")
        .populate("createdBy")
        .populate({
            path: 'project',
            model: 'Project',
            select: { 'title': 1, 'type': 1 },
            populate: {
                path: 'type',
                model: 'ProjectType',
                select: { 'title': 1 }
            }
        }).execPopulate();
}

exports.groupThreadList = async (threadId) => {
    return await GroupThread.findOne({ _id: threadId })
        .populate("users", "profileImage detail.firstName detail.lastName")
        .populate({
            path: 'project',
            model: 'Project',
            select: { 'title': 1, 'type': 1 },
            populate: {
                path: 'type',
                model: 'ProjectType',
                select: { 'title': 1 }
            }
        })
}
exports.groupThreadListByUserId = async (userId) => {
    return await GroupThread.find({ $or: [{ createdBy: userId }, { users: { '$in': [userId] } }] })
        .populate("users", "profileImage detail.firstName detail.lastName detail.name")
        .populate("createdBy")
        .populate({
            path: 'project',
            model: 'Project',
            select: { 'title': 1, 'type': 1 },
            populate: {
                path: 'type',
                model: 'ProjectType',
                select: { 'title': 1 }
            }
        }).sort({ updatedAt: -1 })
}

exports.foundGroupThreadById = async (_id) => {
    return await GroupThread.findOne({ _id: _id });
}

exports.addPersonToGroup = async (_id, userId) => {
    await GroupThread.updateOne({ _id: _id }, { $push: { users: userId } })
}

exports.deletePersonToGroup = async (_id, userId) => {
    await GroupThread.updateOne({ _id: _id }, { $pull: { users: userId } })
}

exports.checkUserOneToOneChat = async (createdBy, userId) => {
    let userChat = await GroupThread.find({ $or: [{ createdBy: createdBy, $where: "this.users.length ==2", users: { '$in': [userId[0]] } }, { $where: "this.users.length ==1", users: { '$in': [userId[0]] } }] }).populate("users", "profileImage detail.firstName detail.lastName")
        .populate("createdBy")
        .populate({
            path: 'project',
            model: 'Project',
            select: { 'title': 1, 'type': 1 },
            populate: {
                path: 'type',
                model: 'ProjectType',
                select: { 'title': 1 }
            }
        })
    console.log({ len: userChat.length });
    if (userChat.length == 0) {
        return 0;
    }
    return userChat[0];
}
exports.updateGroupThreadTime = async (_id) => {
    await GroupThread.updateOne({ _id: _id }, { updatedAt: moment() })
}

