// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const ProjectUser = require("../Models/ProjectUser");
const User = require("../Models/User");

// Constants
const ProjectUserType = require("../Constants/ProjectUserType");
const Role = require("../Constants/Role");


exports.addUser = async (user, project, role) => {

    const projectUser = new ProjectUser({
        _id     : new mongoose.Types.ObjectId(),
        user	: user,
        project	: project,
        role	: role,
    }); 
    return await projectUser.save();
}

// To get the list of participants for a project
exports.listProjectParticipants = async (project) => {
	
    let userIds = await ProjectUser.find({project: project, isDeleted: false, role: ProjectUserType.PARTICIPANT}).distinct('user');
    return await User.find({_id:{ $in: userIds }, isDeleted:false});
}

// To get the list of participants for a project
exports.listAvailableParticipants = async (project, firm) => {
    
    let ignoreRoles = [Role.SUPER_ADMIN];
    let userIds = await ProjectUser.find({project: project, isDeleted: false}).distinct('user');
    return await User.find({_id:{ $nin: userIds }, role:{ $nin: ignoreRoles }, firm:firm, isDeleted:false});
}

// To Check if following user exist against following project
exports.foundProjectUser = async (project,user) => {
	return await ProjectUser.findOne({ project:project, user:user, isDeleted: false });
}

// To get project Ids of a user in which he is owner
exports.foundProjectIdsByOwner = async (user) => {
    return await ProjectUser.find({ user:user, role: ProjectUserType.OWNER, isDeleted: false}).distinct('project');
}

// To get project Ids of a user in which he is participant
exports.foundProjectIdsByParticipant = async (user) => {
    return await ProjectUser.find({ user:user, role: ProjectUserType.PARTICIPANT, isDeleted: false}).distinct('project');
}

// To get project Ids of a user in which he is owner or participant
exports.foundProjectIdsByUser = async (user) => {
    return await ProjectUser.find({ user:user, isDeleted: false}).distinct('project');
}

// Find Onwer of the object
exports.foundProjectOwner = async (project) => {
    return await ProjectUser.findOne({ project:project, role: ProjectUserType.OWNER});
}

// Find those project ids which are not associated with the given users
exports.foundProjectIdsByNotUser = async (user) => {
    return await ProjectUser.find({ user:{ $ne:user }, isDeleted: false}).distinct('project');
}

// To get project Ids of users in which they are owners
exports.foundProjectIdsByOwnerIds = async (user) => {
    return await ProjectUser.find({ user: {$in: user}, isDeleted: false, role: ProjectUserType.OWNER}).distinct('project');
}

// To get project Ids of users in which they are owners
exports.foundProjectIdsByUser = async (user) => {
    return await ProjectUser.find({ user: {$in: user}, isDeleted: false}).distinct('project');
}

// To get get user ids of project
exports.foundProjectUserIds = async (conditionObj) => {
    return await ProjectUser.find(conditionObj).distinct('user');
}

// To get get user ids of project
exports.foundParticipantIdsByProjectIds = async (projectIds) => {
    return await ProjectUser.find({project: {$in: projectIds}, isDeleted:false}).distinct('user');
}

// Delete a participant in the project
exports.deleteParticipant = async (user, project) => {
    let updateInfo = {
        isDeleted   : true,
        deletedAt   : moment()
    }
    await ProjectUser.updateOne({user: user, project: project, isDeleted: false},{$set: updateInfo}).exec();
}
exports.deleteProjectForAllUsers = async (id) => {
    let updateInfo = {
        isDeleted   : true,
        deletedAt   : moment()
    }
    await ProjectUser.updateMany({project: id},{$set: updateInfo}).exec();
}
exports.updateProjectUser = async (findObj,setObj) => {
    return await ProjectUser.updateOne(findObj,{$set:setObj});
}

// Get Project Participants User Ids Staff Only
exports.getProjectUsersStaffOnly = async (project) => {
    return await ProjectUser.find({project: project, isDeleted: false, role: Role.STAFF}).distinct('_id');
}
exports.getRecentProjectsByUser = async (userId) => {
    return await ProjectUser.find({user:userId, isDeleted:false}).sort({_id:-1}).limit(5).populate('user').populate('project');
}
exports.getProjectUsersCount = async (projectId) => {
    return await ProjectUser.find({project:projectId, isDeleted:false}).countDocuments();
}