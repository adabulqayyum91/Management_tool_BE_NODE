// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const User = require("../Models/User");

// Helpers
const GeneralHelper = require("./GeneralHelper");
const TaskHelper = require("./TaskHelper");

// Constants
const Role = require("../Constants/Role.js");


exports.listStaff = async (firm, pageNo, userId, designations=null, searchValue=null, users=null) => {
	
	let pg = GeneralHelper.getPaginationDetails(pageNo);
	let userCondition = [{firm: firm}, {role: Role.STAFF}, {isDeleted: false}, {_id: {$ne:userId}}];

	
	if(users!=null)
	{
		userCondition.push({ "_id": {$in: users} });
	}

	if(designations!=null && designations.length)
	{
		userCondition.push({ designation: {$in: designations} });
	}

	if(GeneralHelper.isValueSet(searchValue))
	{
		regex = GeneralHelper.makeRegex(searchValue);
		userCondition.push({$or: [  
			{ "detail.firstName": { $regex: regex } },
			{ "detail.lastName": { $regex: regex } },
			{ "detail.phoneNumber": { $regex: regex } },
			{ "detail.specialization": { $regex: regex } },
			{ "email": { $regex: regex } },
			]});
	}

	userCondition = {$and: userCondition}

	let result = await User.find(userCondition)
	.populate('firm')
	.populate('designation')
	.sort( { _id : -1 } )
	.skip(pg.skip)
	.limit(pg.pageSize)
	.exec();

	let total = await User.find(userCondition).countDocuments();

	return {
		"pagination":GeneralHelper.makePaginationObject(pg.pageNo,pg.pageSize,pg.skip,total,result.length),
		"data":result
	};
}

exports.listStaffAll = async (firm) => {
	return await User.find({firm: firm, role: Role.STAFF, isDeleted: false});
}

exports.addStaff = async (firstName, lastName, specialization, designation, phoneNumber, firm, email, password, firstTimeToken=null) => {

	let detail = {
		firstName	: firstName,
		lastName	: lastName,
		phoneNumber	: phoneNumber,
		specialization	: specialization,
	};

	const user = new User({
		_id          : new mongoose.Types.ObjectId(),
		email      	 : email.trim().toLowerCase(),
		password     : password,
		role		 : Role.STAFF,
		firm 		 : firm,
		detail 		 : detail,
		firm		 : firm,
		designation	 : designation,
		firstTimeToken: firstTimeToken,
	}); 
	return await user.save();
}

exports.deleteStaff = async (ids) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}

	for(let i=0;i<ids.length;i++){
		await User.updateOne({_id: ids[i]},{$set: updateInfo}).exec();
	}
}

exports.foundStaffCount = async (conditionObj) => {
	return await User.find(conditionObj).countDocuments();
}

exports.completeInfo = async (_id) => {
	return await User.findOne({ _id:_id }).populate('designation');
}


exports.staffBandwidth = async (firm, searchValue=null) => {
	
	let userCondition = [{firm: firm}, {role: Role.STAFF}, {isDeleted: false}];

	if(GeneralHelper.isValueSet(searchValue))
	{
		regex = GeneralHelper.makeRegex(searchValue);
		userCondition.push({$or: [  
			{ "detail.firstName": { $regex: regex } },
			{ "detail.lastName": { $regex: regex } }
			]});
	}
	userCondition = {$and: userCondition}

	let staff = await User.find(userCondition,{ detail:1, profileImage:1, designation:1}).populate('designation','title');
	
	let fromDate = moment().startOf('week');
	let toDate 	= moment().endOf('week');
	let result = [];

	for(let i=0;i<staff.length; i++)
	{
		let userTasksTotalTime  = await TaskHelper.userTasksTotalTime(staff[i]._id, fromDate, toDate);

		if(userTasksTotalTime.length)
			result.push({staff: staff[i], bandwidth: userTasksTotalTime[0]['totalTime']});
		else
			result.push({staff: staff[i], bandwidth: 0});

	}
	return result;
}

exports.totalRegistered = async (firm) => {
	return await User.find({firm: firm, role: Role.STAFF, isDeleted: false}).countDocuments();
}

exports.profile = async (_id) => {
	return await User.findOne({ _id:_id });
}