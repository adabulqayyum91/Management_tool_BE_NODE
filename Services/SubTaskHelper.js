// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');

// Models
const Task = require("../Models/Task");
const User = require("../Models/User");

// Helpers
const ProjectUserHelper = require("./ProjectUserHelper");
const GeneralHelper  	= require("./GeneralHelper");
const MailHelper  	= require("./MailHelper");
const SubTask = require("../Models/SubTask");
const ProjectHelper = require("./ProjectHelper");


exports.listTasks = async (task) => {

	let taskCondition = [{ _id: task }, { isDeleted: false }];
	taskCondition = { $and: taskCondition }

	return await Task.find(taskCondition)
	.populate('user')
	.populate('subTasks')
	.sort({ _id: -1 })
	.exec();
}

exports.listCustomMyTasks = async (project, user, isMeetingView, status) => {

	let taskCondition;
	let optionalTaskCondition=[];
	if(status==="Pending")
		taskCondition = [{ project: project }, { isDeleted: false }, {status: false}]
	else if(status==="All")
		taskCondition = [{ project: project }, { isDeleted: false }]
	else
		taskCondition = [{ project: project }, { isDeleted: false }, {status: true}]


	if (isMeetingView) 
		optionalTaskCondition.push({ meetingView: true });
	else
		optionalTaskCondition.push({ user: user });


	if (optionalTaskCondition.length) {
		taskCondition.push({ $or: optionalTaskCondition });
	}

	taskCondition = { $and: taskCondition }

	return await Task.find(taskCondition)
	.populate('user')
	.sort({ _id: -1 })
	.exec();
}

exports.addTask = async (title,project, user, estimatedTime, dueDate, matterView, meetingView,taskId) => {

	const subTask = new SubTask({
		_id: new mongoose.Types.ObjectId(),
		title: title,
		user: user,
		project: project,
		dueDate: dueDate,
		estimatedTime: estimatedTime,
		matterView: matterView,
		meetingView: meetingView,
		task:mongoose.Types.ObjectId(taskId),
	});
	return await subTask.save();
}


exports.deleteTask = async (id) => {
	let updateInfo = {
		isDeleted: true,
		deletedAt: moment()
	}
	await SubTask.updateOne({ _id: id }, { $set: updateInfo }).exec();
}

exports.updateTask = async (findObj, setObj) => {
	return await SubTask.updateOne(findObj, { $set: setObj });
}

exports.foundTaskById = async (_id) => {
	return await SubTask.findOne({ _id: _id });
}

exports.foundTaskByIdWithUser = async (_id) => {
	return await Task.findOne({ _id: _id }).populate('user', '_id , email , role , profileImage , detail');
}

exports.foundTaskByTitle = async (title, project) => {
	return await Task.findOne({ title: title, project: project });
}

exports.foundTaskByIdAndTitle = async (_id, title) => {
	return await Task.findOne({ _id: _id, title: title });
}

exports.userPendingTasks = async (user) => {
	return await Task.find({ user: user, isDeleted: false, status: false });
}

exports.userCompletedTasks = async (user) => {
	return await Task.find({ user: user, isDeleted: false, status: true });
}

exports.userTasksTotalTime = async (user, fromDate, toDate) => {
	return await Task.aggregate([
	{
			$match: { user: user, status: false },// createdAt: { $gte: fromDate, $lte: toDate }}
		},
		{
			$group: {
				_id: "$user",
				totalTime: { '$sum': "$estimatedTime" }
			}
		}
		]);
}

// To get the list of participants for a task
exports.listAvailableParticipants = async (project) => {
	let userIds = await ProjectUserHelper.foundProjectUserIds({project: project, isDeleted: false });
	return await User.find({_id:{ $in: userIds }, isDeleted:false});
}

exports.sendTaskEmail = async (createdBy, projectName, taskName, assignTo, dueDate, projectId) => {

	let creater = await User.findOne({_id:createdBy, isDeleted:false});
	let link = GeneralHelper.genertateProjectViewPageLink(projectId);
	let assetsPath = GeneralHelper.getBackAppUrl();
	let creatorName = creater.detail.firstName ? creater.detail.firstName + ' ' + creater.detail.lastName : creater.detail.name;

	assignee = await User.findOne({_id:assignTo, isDeleted:false});
	const replacements = {
		email       : assignee.email,
		link        : link,
		appName     : process.env.APP_NAME,
		assetsPath  : assetsPath,
		projectName : projectName,
		taskName : taskName,
		dueDate : dueDate,
		addedBy		: creatorName
	};
	MailHelper.addedToTaskEmail(assignee.email,replacements);	
}

exports.taskStatusUpdateEmail = async (userId, taskName, status, projectId) => {

	status = status? "Completed" : "Pending";

	let completedBy = await User.findOne({_id:userId, isDeleted:false});
	let link = GeneralHelper.genertateProjectViewPageLink(projectId);
	let assetsPath = GeneralHelper.getBackAppUrl();
	let completedByName = completedBy.detail.firstName ? completedBy.detail.firstName +' '+ completedBy.detail.lastName: completedBy.detail.name;

	collaborators = await ProjectUserHelper.foundProjectUserIds({ project:projectId});
	project = await ProjectHelper.foundProjectById(projectId);

	if(collaborators!=null && collaborators.length)
	{
		for(let i=0; i<collaborators.length; i++)
		{
			if(collaborators[i]!=userId)
			{
				collaborator = await User.findOne({_id:collaborators[i], isDeleted:false});
				const replacements = {
					email       : collaborator.email,
					link        : link,
					appName     : process.env.APP_NAME,
					assetsPath  : assetsPath,
					taskName : taskName,
					projectName: project.title,
					status : status,
					completedBy : completedByName
				};
				MailHelper.taskStatusUpdateEmail(collaborator.email,replacements);	
			}
		}
	}
	let userIds = await ProjectUserHelper.foundProjectUserIds({ project: projectId, isDeleted: false });
	return await User.find({ _id: { $in: userIds }, isDeleted: false });
}
// get completed tak list by project id
exports.listCompletedProjectTaskList = async (project) => {

	let taskCondition = [{ project: project }, { isDeleted: false, status: true }];
	taskCondition = { $and: taskCondition }

	return await Task.find(taskCondition)
	.populate('user')
	.sort({ _id: -1 })
	.exec();
}
// get pending tak list by project id

exports.listPendingProjectTaskList = async (project) => {

	let taskCondition = [{ project: project }, { isDeleted: false, status: false }];
	taskCondition = { $and: taskCondition }

	return await Task.find(taskCondition)
	.populate('user')
	.sort({ _id: -1 })
	.exec();
}

exports.updateCompeteTask = async (taskObj) => {
	let foundTask = await SubTask.findOne({ _id: taskObj.taskId });
	foundTask.title = taskObj.title || foundTask.title;
	foundTask.user = taskObj.user || foundTask.user;
	foundTask.dueDate = taskObj.dueDate || foundTask.dueDate;
	foundTask.estimatedTime = taskObj.estimatedTime || foundTask.estimatedTime;
	foundTask.matterView = taskObj.matterView || foundTask.matterView;
	foundTask.meetingView = taskObj.meetingView || foundTask.meetingView;
	return await foundTask.save();

}