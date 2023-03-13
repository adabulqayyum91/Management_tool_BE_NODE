//Mongoose
const mongoose = require('mongoose');

//Moment
const moment = require('moment');

//Model
const ProjectStatus = require('../Models/ProjectStatus');


exports.listProjectStatus = async (firm) => {
	
	let projectStatusCondition = [{firm: firm}, {isDeleted: false}];
	projectStatusCondition = {$and: projectStatusCondition};

	return await ProjectStatus.find(projectStatusCondition).exec();
}

exports.addProjectStatus = async (title, firm) => {

    const projectstatus = new ProjectStatus({
        _id     : new mongoose.Types.ObjectId(),
        title	: title.trim(),
        firm	: firm,
    }); 
    return await projectstatus.save();
}

exports.deleteProjectStatus = async (id) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}
	await ProjectStatus.updateOne({_id: id},{$set: updateInfo}).exec();
}

exports.updateProjectStatus = async (findObj,setObj) => {
    return await ProjectStatus.updateOne(findObj,{$set:setObj});
}

exports.foundProjectStatusById = async (_id) => {
	return await ProjectStatus.findOne({ _id:_id });
}

exports.foundProjectStatusByTitle = async (title,firm) => {
	let regex = new RegExp(title.trim(),'i');
	return await ProjectStatus.findOne({ title: { $regex: regex }, firm:firm, isDeleted:false });
}

exports.foundProjectStatusByIdAndTitle = async (_id,title) => {
	let regex = new RegExp(title.trim(),'i');
	return await ProjectStatus.findOne({ _id:_id , title: { $regex: regex } });
}
exports.updateProjectHideStatus = async (findObj,setObj) => {
    return await ProjectStatus.updateMany(findObj,{$set:setObj});
}