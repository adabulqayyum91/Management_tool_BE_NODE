//Mongoose
const mongoose = require('mongoose');

//Moment
const moment = require('moment');

//Model
const ProjectType = require('../Models/ProjectType');


exports.listProjectType = async (firm) => {
	
	let projectTypeCondition = [{firm: firm}, {isDeleted: false}];
	projectTypeCondition = {$and: projectTypeCondition};

	return await ProjectType.find(projectTypeCondition).exec();
}

exports.addProjectType = async (title, firm) => {

    const projecttype = new ProjectType({
        _id     : new mongoose.Types.ObjectId(),
        title	: title.trim(),
        firm	: firm,
    }); 
    return await projecttype.save();
}

exports.deleteProjectType = async (id) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}
	await ProjectType.updateOne({_id: id},{$set: updateInfo}).exec();
}

exports.updateProjectType = async (findObj,setObj) => {
    return await ProjectType.updateOne(findObj,{$set:setObj});
}

exports.foundProjectTypeById = async (_id) => {
	return await ProjectType.findOne({ _id:_id });
}

exports.foundProjectTypeByTitle = async (title,firm) => {
	let regex = new RegExp(title.trim(),'i');
	return await ProjectType.findOne({ title: { $regex: regex }, firm:firm, isDeleted:false });
}

exports.foundProjectTypeByIdAndTitle = async (_id,title) => {
	let regex = new RegExp(title.trim(),'i');
	return await ProjectType.findOne({ _id:_id , title: { $regex: regex } });
}

exports.updateProjectHideStatus = async (findObj,setObj) => {
	return await ProjectType.updateMany(findObj,{$set:setObj});
}
