// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');

// Models
const Project = require("../Models/Project");
const User = require("../Models/User");

// Constants
const ProjectConst = require("../Constants/Project");
const ProjectUserType = require("../Constants/ProjectUserType");

// Helpers
const ProjectUserHelper = require("./ProjectUserHelper");
const UserHelper = require("./UserHelper");
const GeneralHelper = require("./GeneralHelper");
const MailHelper = require("./MailHelper");
const TaskHelper = require("./TaskHelper");
const {listProjectFiles} = require("./FileHelper");


exports.listOwnProjectsWithFilters = async (firm, pageNo, statuses = [], types = [], users = [], myProject = true, userId, searchValue = null, customFieldOptions = [], customFieldOptions2 = []) => {

	let pg = GeneralHelper.getPaginationDetails(pageNo);
	let projectCondition = [{ firm: firm }, { isDeleted: false }];
	let projectOptionalCondition = [], result = [];

	if (statuses != null && statuses.length) {
		projectCondition.push({ status: { $in: statuses } });
	}

	if (types != null && types.length) {
		projectCondition.push({ type: { $in: types } });
	}

	if (customFieldOptions != null && customFieldOptions.length) {
		projectCondition.push({ customFieldOption: { $in: customFieldOptions } });
	}

	if (customFieldOptions2 != null && customFieldOptions2.length) {
		projectCondition.push({ customFieldOption2: { $in: customFieldOptions2 } });
	}

	if (users != null && users.length) {
		let userProjectIds = await ProjectUserHelper.foundProjectIdsByUser(users);
		projectOptionalCondition.push({ _id: { $in: userProjectIds } });
	}

	if (myProject) {
		let projectIds = await ProjectUserHelper.foundProjectIdsByUser(userId);
		projectCondition.push({ _id: { $in: projectIds } });
	}
	else {

		let userProjectIds = await ProjectUserHelper.foundProjectIdsByUser(userId);
		userProjectIds = await Project.find({ _id: { $in: userProjectIds } }).distinct('_id');

		let nonUserProjectIds = await ProjectUserHelper.foundProjectIdsByNotUser(userId);
		nonUserProjectIds = await Project.find({ _id: { $in: nonUserProjectIds }, privacy: ProjectConst.PRIVACY_PUBLIC }).distinct('_id');

		let projectIds = userProjectIds.concat(nonUserProjectIds);

		projectCondition.push({ _id: { $in: projectIds } });
	}

	if (GeneralHelper.isValueSet(searchValue)) {
		searchValue = GeneralHelper.escapeLike(searchValue);
		regex = new RegExp(searchValue, 'i');

		projectOptionalCondition.push({ title: { $regex: regex } });
	}

	if (projectOptionalCondition.length) {
		projectCondition.push({ $or: projectOptionalCondition });
	}

	projectCondition = { $and: projectCondition }

	let projects = await Project.find(projectCondition)
		.populate('status')
		.populate('type')
		.populate('customFieldOption')
		.sort({ _id: -1 })
		.skip(pg.skip)
		.limit(pg.pageSize)
		.exec();
	for (let i = 0; i < projects.length; i++) {
		let projectOwner = await ProjectUserHelper.foundProjectOwner(projects[i]._id);
		let owner = await UserHelper.foundUserById(projectOwner.user);
		result.push({ details: projects[i], user: owner });
	}
	let total = await Project.find(projectCondition).countDocuments();

	return {
		"pagination": GeneralHelper.makePaginationObject(pg.pageNo, pg.pageSize, pg.skip, total, projects.length),
		"data": result
	};
}

exports.listFirmProjectsWithFilters = async (firm, pageNo, statuses = [], types = [], users = [], searchValue = null, customFieldOptions = [], meetingView = false, customFieldOptions2 = []) => {

	let pg = GeneralHelper.getPaginationDetails(pageNo);
	let projectCondition = [{ firm: firm }, { isDeleted: false }];
	let projectOptionalCondition = [], result = [];

	if (meetingView)
		projectCondition.push({ privacy: ProjectConst.PRIVACY_PUBLIC })

	if (statuses != null && statuses.length) {
		projectCondition.push({ status: { $in: statuses } });
	}

	if (types != null && types.length) {
		projectCondition.push({ type: { $in: types } });
	}

	if (customFieldOptions != null && customFieldOptions.length) {
		projectCondition.push({ customFieldOption: { $in: customFieldOptions } });
	}

	if (customFieldOptions2 != null && customFieldOptions2.length) {
		projectCondition.push({ customFieldOption2: { $in: customFieldOptions2 } });
	}

	if (users != null && users.length) {
		let userProjectIds = await ProjectUserHelper.foundProjectIdsByUser(users);
		projectOptionalCondition.push({ _id: { $in: userProjectIds } });
	}

	if (GeneralHelper.isValueSet(searchValue)) {
		searchValue = GeneralHelper.escapeLike(searchValue);
		regex = new RegExp(searchValue, 'i');

		projectOptionalCondition.push({ title: { $regex: regex } });
	}

	if (projectOptionalCondition.length) {
		projectCondition.push({ $or: projectOptionalCondition });
	}

	projectCondition = { $and: projectCondition }

	let projects = await Project.find(projectCondition)
		.populate('status')
		.populate('type')
		.populate('customFieldOption')
		.populate('customFieldOption2')
		.sort({ _id: -1 })
		.skip(pg.skip)
		.limit(pg.pageSize)
		.exec();
	for (let i = 0; i < projects.length; i++) {
		let projectOwner = await ProjectUserHelper.foundProjectOwner(projects[i]._id);
		let owner = await UserHelper.foundUserById(projectOwner.user);
		result.push({ details: projects[i], user: owner });
	}
	let total = await Project.find(projectCondition).countDocuments();

	return {
		"pagination": GeneralHelper.makePaginationObject(pg.pageNo, pg.pageSize, pg.skip, total, projects.length),
		"data": result
	};
}

exports.listOwnProjects = async (userId) => {

	let projectIds = await ProjectUserHelper.foundProjectIdsByUser(userId);
	return await Project.find({ _id: { $in: projectIds }, isDeleted: false })
		.sort({ _id: -1 })
		.exec();
}

exports.listFirmProjects = async (firm) => {
	return await Project.find({ firm: firm, isDeleted: false })
		.sort({ _id: -1 })
		.exec();
}

exports.listFirmPublicProjectIds = async (firm) => {
	return await Project.find({ firm: firm, isDeleted: false, privacy: ProjectConst.PRIVACY_PUBLIC })
		.sort({ _id: -1 })
		.distinct()
		.exec();
}

exports.addProject = async (title, type = null, status = null, privacy, firm, description, customFieldOption = null, customFieldOption2 = null, company = "", project = "") => {

	const projectRes = new Project({
		_id: new mongoose.Types.ObjectId(),
		title: title,
		type: type && type !== '' ? type : null,
		status: status,
		privacy: privacy,
		firm: firm,
		description: description,
		customFieldOption: customFieldOption && customFieldOption.length > 0 && customFieldOption !== '' ? customFieldOption : null,
		customFieldOption2: customFieldOption2 && customFieldOption2.length > 0 && customFieldOption !== '' ? customFieldOption2 : null,
		company: company,
		project: project,
	});
	return await projectRes.save();
}

exports.addProjectUser = async (createdBy, project, users = []) => {

	let owner = await ProjectUserHelper.addUser(createdBy, project, ProjectUserType.OWNER);

	if (users != null && users.length) {
		for (let i = 0; i < users.length; i++) {
			participants = await ProjectUserHelper.addUser(users[i], project, ProjectUserType.PARTICIPANT);
		}
	}

	return owner;
}

exports.sendEmailToCollaborators = async (createdBy, projectId, projectName, users = []) => {

	let owner = await User.findOne({ _id: createdBy, isDeleted: false });
	let link = GeneralHelper.genertateProjectViewPageLink(projectId);
	let assetsPath = GeneralHelper.getBackAppUrl();
	let ownerName = owner.detail.firstName ? owner.detail.firstName + ' ' + owner.detail.lastName : owner.detail.name;

	if (users != null && users.length) {
		for (let i = 0; i < users.length; i++) {
			user = await User.findOne({ _id: users[i], isDeleted: false });
			const replacements = {
				email: user.email,
				link: link,
				appName: process.env.APP_NAME,
				assetsPath: assetsPath,
				projectName: projectName,
				addedBy: ownerName
			};
			MailHelper.addedToProjectEmail(user.email, replacements);
		}
	}
}


exports.deleteProject = async (id) => {
	let updateInfo = {
		isDeleted: true,
		deletedAt: moment()
	}
	await Project.updateOne({ _id: id }, { $set: updateInfo }).exec();
	ProjectUserHelper.deleteProjectForAllUsers(id);
}

exports.updateProject = async (findObj, setObj) => {
	return await Project.updateOne(findObj, { $set: setObj });
}

exports.foundProjectById = async (_id) => {
	return await Project.findOne({ _id: _id }).populate('status').populate('type').populate('customFieldOption').populate('customFieldOption2');
}

exports.foundProjectByTitle = async (title, firm) => {
	return await Project.findOne({ title: title, firm: firm });
}

exports.foundProjectByIdAndTitle = async (_id, title) => {
	return await Project.findOne({ _id: _id, title: title });
}

exports.foundProjectCount = async (conditionObj) => {
	return await Project.find(conditionObj).countDocuments();
}

exports.totalProjects = async (firm) => {
	return await Project.find({ firm: firm, isDeleted: false }).countDocuments();
}
exports.getProjectDetailByProjectId = async (projectId) => {
	return await Project.find({ _id: projectId, isDeleted: false });
}
exports.getRecentProjects = async (firmId, userId) => {
	let userProjects = await ProjectUserHelper.getRecentProjectsByUser(userId);
	let recentProjectArr=[];
	for(i=0; i< userProjects.length; i++){
		let projectId = userProjects[i].project._id;
		let tasks = await TaskHelper.listTasks(projectId);
		let userCount = await ProjectUserHelper.getProjectUsersCount(projectId);
		let attachmentsCounts = await listProjectFiles(projectId);
		let projectOwner = await ProjectUserHelper.foundProjectOwner(projectId);
		let owner = await UserHelper.foundUserById(projectOwner.user);
		console.log({owner});
		let pending=tasks.filter(task=>task.status=== false).length;
		let complete=tasks.length-pending;
		let res={
			projectTitle:userProjects[i].project.title,
			createdBy:owner.detail.firstName? `${owner.detail.firstName} ${owner.detail.lastName}`: `${owner.detail.name}`,
			userCount,
			pending,
			complete,
			attachmentsCounts: attachmentsCounts.length,
			progress:tasks.length !==0?((complete/tasks.length)*100).toFixed(0) : 0,
			projectId
		}
		recentProjectArr.push(res);
		// 	let createdBy =
	}
	return recentProjectArr;


}