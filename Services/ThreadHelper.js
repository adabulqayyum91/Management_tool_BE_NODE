// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');

// Models
const Thread = require("../Models/Thread");
const ThreadUser = require("../Models/ThreadUser");


// Helpers
const GeneralHelper = require("./GeneralHelper");


exports.listThreads = async (user) => {

	let threads = await ThreadUser.find({ user: user }).distinct('thread');

	threads = await Thread.find({ _id: { $in: threads } })
		.populate('userA', { _id: 1, detail: 1, profileImage: 1 })
		.populate('userB', { _id: 1, detail: 1, profileImage: 1 })
		.sort({ _id: -1 })
		.exec();

	let result = [];
	for (let i = 0; i < threads.length; i++) {

		let userIds = await ThreadUser.find({ thread: threads[i]._id }).distinct('user');
		let users = await User.find({ _id: { $in: userIds } });
		result.push({ details: threads[i], users: users });
	}

	return result;
}

exports.createThread = async (userA, userB, project = null) => {

	const thread = new Thread({
		_id: new mongoose.Types.ObjectId(),
		project: project,
		userA: userA,
		userB: userB,
		type: "Normal",
	})
	await thread.save();
	console.log({ "create": 'create' });
	const threadDetail = thread.populate({
		path: 'project',
		model: 'Project',
		select: { 'title': 1, 'type': 1 },
		populate: {
			path: 'type',
			model: 'ProjectType',
			select: { 'title': 1 }
		}
	})
		.populate({
			path: 'userA',
			model: 'User',
			select: { 'detail.firstName': 1, 'detail.lastName': 1, 'profileImage': 1 }
		})
		.populate({
			path: 'userB',
			model: 'User', select: { 'detail.firstName': 1, 'detail.lastName': 1, 'profileImage': 1 }
		}).execPopulate();

	const threadUserA = new ThreadUser({
		_id: new mongoose.Types.ObjectId(),
		thread: threadDetail._id,
		user: userA,
	});
	await threadUserA.save();

	const threadUserB = new ThreadUser({
		_id: new mongoose.Types.ObjectId(),
		thread: threadDetail._id,
		user: userB,
	});
	await threadUserB.save();

	return threadDetail;
}

exports.createGroupThread = async (title, users = [], image = null) => {

	const thread = new Thread({
		_id: new mongoose.Types.ObjectId(),
		title: title,
		image: image,
		type: "Group",
	});
	await thread.save();

	if (users != null && users.length) {
		for (let i = 0; i < users.length; i++) {
			threadUser = new ThreadUser({
				_id: new mongoose.Types.ObjectId(),
				thread: thread._id,
				user: users[i],
			});
			await threadUser.save();
		}
	}

	return thread;
}

exports.getThread = async (userA, userB, project = null) => {

	return await Thread.findOne({
		$and: [
			{ project: project },
			{
				$or: [
					{
						$and: [
							{ userA: userA },
							{ userB: userB }
						]
					},
					{
						$and: [
							{ userA: userB },
							{ userB: userA }
						]
					},
				]
			}
		]

	})
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
		.populate({
			path: 'userA',
			model: 'User',
			select: { 'detail.firstName': 1, 'detail.lastName': 1, 'profileImage': 1 }
		})
		.populate({
			path: 'userB',
			model: 'User', select: { 'detail.firstName': 1, 'detail.lastName': 1, 'profileImage': 1 }
		})
		.exec();
}


exports.deleteTask = async (id) => {
	let updateInfo = {
		isDeleted: true,
		deletedAt: moment()
	}
	await Thread.updateOne({ _id: id }, { $set: updateInfo }).exec();
}

exports.updateThread = async (findObj, setObj) => {
	return await Task.updateOne(findObj, { $set: setObj });
}

exports.foundThreadById = async (_id) => {
	return await Task.findOne({ _id: _id });
}