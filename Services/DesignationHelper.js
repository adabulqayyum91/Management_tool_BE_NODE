// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const Designation = require("../Models/Designation");

// Helpers
const GeneralHelper = require("./GeneralHelper");


exports.listDesignations = async (firm) => {
	
	let designationCondition = [{firm: firm},{isDeleted: false}];
	designationCondition = {$and: designationCondition}

	return await Designation.find(designationCondition).exec();
}

exports.addDesignation = async (title, firm) => {
    const designation = new Designation({
        _id     : new mongoose.Types.ObjectId(),
        title	: title.trim(),
        firm	: firm,
    }); 
    return await designation.save();
}

exports.deleteDesignation = async (id) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}
	await Designation.updateOne({_id: id},{$set: updateInfo}).exec();
}

exports.updateDesignation = async (findObj,setObj) => {
    return await Designation.updateOne(findObj,{$set:setObj});
}

exports.foundDesignationById = async (_id) => {
	return await Designation.findOne({ _id:_id });
}

exports.foundDesignationByTitle = async (title,firm) => {
	let regex = new RegExp(title.trim(),'i');
	return await Designation.findOne({ title: { $regex: regex }, firm:firm, isDeleted:false });
}


exports.foundDesignationByIdAndTitle = async (_id,title) => {
	let regex = new RegExp(title.trim(),'i');
	return await Designation.findOne({ _id:_id , title: { $regex: regex } });
}