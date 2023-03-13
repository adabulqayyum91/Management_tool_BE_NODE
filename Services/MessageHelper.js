// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');

// Models
const Message = require("../Models/Message");

// Helpers
const GeneralHelper = require("./GeneralHelper");
const GroupThreadHelper = require("./GroupThreadHelper");


exports.listMessages = async (thread) => {
	return await Message.find({ thread: thread, isDeleted: false })
		.populate('user', { _id: 1, detail: 1, profileImage: 1 })
		.sort({ _id: -1 })
		.exec();
}

exports.createMessage = async (user, thread, text = null, attachment = null) => {
	await GroupThreadHelper.updateGroupThreadTime(thread)
	const message = new Message({
		_id: new mongoose.Types.ObjectId(),
		user: user,
		thread: thread,
		text: text,
		attachment: attachment,
	});
	await message.save();
	return message.populate('user', { _id: 1, detail: 1, profileImage: 1 }).execPopulate();
}

exports.deleteMessage = async (id) => {
	let updateInfo = {
		isDeleted: true,
		deletedAt: moment()
	}
	await Message.updateOne({ _id: id }, { $set: updateInfo }).exec();
}

exports.updateMessage = async (findObj, setObj) => {
	return await Message.updateOne(findObj, { $set: setObj });
}

exports.foundMessageById = async (_id) => {
	return await Message.findOne({ _id: _id });
}

exports.userMessagesCounter = async (userId) => {
	return await Message.count({ user : userId });
}