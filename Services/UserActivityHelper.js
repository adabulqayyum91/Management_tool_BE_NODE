//Mongoose
const mongoose = require('mongoose');

//Model
const UserActivity = require('../Models/UserActivity');

// Constants
const ProjectConst = require("../Constants/Project");
const Role = require("../Constants/Role");
const UserActivityConst = require("../Constants/UserActivity");

// Helpers
const ProjectStatusHelper = require("./ProjectStatusHelper");
const ProjectTypeHelper = require("./ProjectTypeHelper");
const ProjectHelper = require("./ProjectHelper");
const DesignationHelper = require("./DesignationHelper");
const StaffHelper = require("./StaffHelper");
const ClientHelper = require("./ClientHelper");
const AdminHelper = require("./AdminHelper");
const GeneralHelper = require("./GeneralHelper");
const UserActivityHelper = require("./UserActivityHelper");



// Get the full list of User Activity with pagination and filters
exports.listUserActivity = async (firm, pageNo, filter, startDate, endDate, userId = null, projects = null) => {

	let pg = GeneralHelper.getPaginationDetails(pageNo);

	let { SD, ED } = GeneralHelper.getDateRange(filter, startDate, endDate);

	let activityCondition = [{ firm: firm }, { isDeleted: false }, { createdAt: { $gte: SD, $lte: ED } }];
	let activityOptionalCondition = [];

	if (projects != null && projects.length)
		activityOptionalCondition.push({ project: { $in: projects } });

	if (userId)
		activityOptionalCondition.push({ user: userId });

	if (activityOptionalCondition.length)
		activityCondition.push({ $or: activityOptionalCondition });


	activityCondition = { $and: activityCondition }

	let activites = await UserActivity.find(activityCondition)
		.populate('user')
		.sort({ _id: -1 })
		.skip(pg.skip)
		.limit(pg.pageSize)
		.exec();

	let total = await UserActivity.find(activityCondition).countDocuments();

	return {
		"pagination": GeneralHelper.makePaginationObject(pg.pageNo, pg.pageSize, pg.skip, total, activites.length),
		"data": activites
	};
}

// Get the Recent Activities only
exports.listRecentUserActivity = async (firm, userId = null, projects = null) => {

	let activityCondition = [{ firm: firm }, { isDeleted: false }];
	let activityOptionalCondition = [];

	if (projects != null && projects.length)
		activityOptionalCondition.push({ project: { $in: projects } });

	if (userId)
		activityOptionalCondition.push({ user: userId });

	if (activityOptionalCondition.length)
		activityCondition.push({ $or: activityOptionalCondition });

	activityCondition = { $and: activityCondition }

	let activites = await UserActivity.find(activityCondition)
		.populate('user')
		.sort({ _id: -1 })
		.limit(UserActivityConst.RECENT_LIMIT)
		.exec();

	return activites;
}

// Add User Activity
exports.addUserActivity = async (user, type, firm, text, project) => {

	const userActivity = new UserActivity({
		_id: new mongoose.Types.ObjectId(),
		user: user,
		type: type,
		firm: firm,
		text: text,
		project: project
	});
	await userActivity.save();
}

// Store Project Status Change Activity
exports.activityProjectStatusChange = async (userId, firmId, projectId, projectName, oldStatusId, newStatusId) => {

	let oldStatus = await ProjectStatusHelper.foundProjectStatusById(oldStatusId);
	let newStatus = await ProjectStatusHelper.foundProjectStatusById(newStatusId);

	let text = `changed the status of project ${projectName} from ${oldStatus.title} to ${newStatus.title}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}

// Store Project Type Change Activity
exports.activityProjectTypeChange = async (userId, firmId, projectId, projectName, oldTypeId, newTypeId) => {

	let oldType = await ProjectTypeHelper.foundProjectTypeById(oldTypeId);
	let newType = await ProjectTypeHelper.foundProjectTypeById(newTypeId);

	let text = `changed the type of project ${projectName} from ${oldType.title} to ${newType.title}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}

// Store Project Privacy Change Activity
exports.activityProjectPrivacyChange = async (userId, firmId, projectId, projectName, newPrivacy) => {

	let oldPrivacy = (newPrivacy === ProjectConst.PRIVACY_PUBLIC) ? ProjectConst.PRIVACY_PRIVATE : ProjectConst.PRIVACY_PUBLIC;

	let text = `changed the privacy of project ${projectName} from ${oldPrivacy} to ${newPrivacy}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}

// Store Project Title Change Activity
exports.activityProjectTitleChange = async (userId, firmId, projectId, projectNameOld, projectNameNew) => {

	let text = `changed the description of project ${projectNameOld} to ${projectNameNew}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}
// Store Project Title Change Activity
exports.activityProjectCompanyChange = async (userId, firmId, projectId, projectCompanyOld, projectCompanyNew) => {

	let text = `changed the company of project ${projectCompanyOld} to ${projectCompanyNew}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}
exports.activityProjectProjectChange = async (userId, firmId, projectId, projectOld, projectNew) => {

	let text = `changed the project field of project ${projectOld} to ${projectNew}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}
// Store Project Title Change Activity
exports.activityProjectDelete = async (userId, firmId, projectId, projectName) => {

	let text = `deleted the project ${projectName}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_PROJECT, firmId, text, projectId);
}

// Store Task change activity
exports.activityTaskCreate = async (userId, firmId, projectId, projectName, taskName) => {
	let text = `added the task ${taskName} to the project ${projectName}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_TASK, firmId, text, projectId);
}
// Store sub Task change activity
exports.activitySubTaskCreate = async (userId, firmId, taskId, taskName, subTaskName) => {
	let text = `added the sub task ${subTaskName} to the task ${taskName}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_SUB_TASK, firmId, text, taskId);
}

// Store Task status change
exports.activityTaskStatusChange = async (userId, firmId, projectId, taskName, taskStatus) => {

	let status = taskStatus ? "Completed" : "Pending";

	let text = `changed the status of the task ${taskName} to ${status}.`;
	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_TASK, firmId, text, projectId);
}

// Store File Add Activity
exports.activityFileAdd = async (userId, firmId, projectId = null) => {

	let text;
	if (projectId == null) {
		text = `added the file.`;
	}
	else {
		let project = await ProjectHelper.foundProjectById(projectId);
		text = `added the file to the project ${project.title}.`;
	}

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_FILE, firmId, text, projectId);
}

// Store New Staff Activity
exports.activityNewStaff = async (userId, firmId, staffName, designationId) => {

	let designation = await DesignationHelper.foundDesignationById(designationId);
	let text = `added the new staff ${staffName} as ${designation.title}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_STAFF, firmId, text, null);
}

// Store New Client Activity
exports.activityNewClient = async (userId, firmId, clientName) => {

	let text = `added the new client ${clientName}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_CLIENT, firmId, text, null);
}


// Delete Staff Activity
exports.activityStaffDelete = async (userId, firmId, staffIds) => {

	let names = "";
	for (let i = 0; i < staffIds.length; i++) {
		staff = await UserHelper.foundUserById(staffIds[i]);

		if (i == 0)
			names = `${staff.detail.firstName} ${staff.detail.lastName}`;
		else
			names = `${names}, ${staff.detail.firstName} ${staff.detail.lastName}`;

	}
	let text = `deleted ${names}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_STAFF, firmId, text, null);
}

// Delete Client Activity
exports.activityClientDelete = async (userId, firmId, clientIds) => {

	let names = "";
	for (let i = 0; i < clientIds.length; i++) {
		client = await UserHelper.foundUserById(clientIds[i]);

		if (i == 0)
			names = `${client.firstName} ${client.lastName}`;
		else
			names = `${names}, ${client.firstName} ${client.lastName}`;

	}
	let text = `deleted ${names}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_CLIENT, firmId, text, null);
}


// Store New Comment Activity
exports.activityNewComment = async (userId, firmId, projectId, comment) => {

	let project = await ProjectHelper.foundProjectById(projectId);
	let text = `added a new comment "${comment}" to the project ${project.title}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_COMMENT, firmId, text, projectId);
}
// store update comment
exports.activityUpdateComment = async (userId, firmId, projectId, comment) => {

	let project = await ProjectHelper.foundProjectById(projectId);
	let text = `updated a comment "${comment}" to the project ${project.title}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_COMMENT, firmId, text, projectId);
}
// store delete comment
exports.activityDeleteComment = async (userId, firmId, projectId, comment) => {

	let project = await ProjectHelper.foundProjectById(projectId);
	let text = `delete a comment "${comment}" to the project ${project.title}.`;

	UserActivityHelper.addUserActivity(userId, UserActivityConst.TYPE_COMMENT, firmId, text, projectId);
}