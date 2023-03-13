// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const User = require("../Models/User");

// Helpers
const GeneralHelper = require("./GeneralHelper");

// Constants
const Role = require("../Constants/Role.js");


exports.listClient = async (firm, pageNo, searchValue=null) => {
	
	let pg = GeneralHelper.getPaginationDetails(pageNo);
	let userCondition = [{firm: firm}, {role: Role.CLIENT}, {isDeleted: false}];

	// Search Field Section
	if(GeneralHelper.isValueSet(searchValue))
	{
		regex = GeneralHelper.makeRegex(searchValue);
		userCondition.push({$or: [  
								{ "detail.firstName": { $regex: regex } },
								{ "detail.lastName": { $regex: regex } },
								{ "detail.phoneNumber": { $regex: regex } },
								{ "detail.address": { $regex: regex } },
								{ "email": { $regex: regex } },
							]});
	}

	userCondition = {$and: userCondition}

	let result = await User.find(userCondition)
				    		.populate('firm')
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

exports.addClient = async (firstName, lastName, address, phoneNumber, firm, email, password, firstTimeToken=null) => {
    
    let detail = {
    	firstName	: firstName,
        lastName	: lastName,
        address		: address,
        phoneNumber	: phoneNumber,
    };

    const user = new User({
        _id          : new mongoose.Types.ObjectId(),
        email      	 : email.trim().toLowerCase(),
        password     : password,
		role		 : Role.CLIENT,
		firm 		 : firm,
		detail 		 : detail,
        firstTimeToken: firstTimeToken,
    }); 
    return await user.save();
}

exports.deleteClient = async (ids) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}

	for(let i=0;i<ids.length;i++){
		await User.updateOne({_id: ids[i]},{$set: updateInfo}).exec();
	}
}

exports.updateClient = async (findObj,setObj) => {
    return await User.updateOne(findObj,{$set:setObj});
}

exports.completeInfo = async (_id) => {
	return await User.findOne({ _id:_id });
}

exports.totalRegistered = async (firm) => {
    return await User.find({firm: firm, role: Role.CLIENT, isDeleted:false}).countDocuments();
}

exports.profile = async (_id) => {
    return await User.findOne({_id:_id});
}