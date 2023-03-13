// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Constants
const Role = require("../Constants/Role.js");
const FirmStatus = require("../Constants/FirmStatus.js");
const Designation = require("../Constants/Designation.js");

// Models
const Firm = require("../Models/Firm");
const User = require("../Models/User");

// Helper
const GeneralHelper = require("./GeneralHelper");
const DesignationHelper = require("./DesignationHelper");


exports.listFirms = async (status, isDeleted, pageNo, searchValue) => {

	let pg = GeneralHelper.getPaginationDetails(pageNo);
	
	let firmCondition = [{status:status},{isDeleted:isDeleted}];
	let userCondition = [{role: Role.ADMIN}]


	if(GeneralHelper.isValueSet(searchValue))
	{
		regex = GeneralHelper.makeRegex(searchValue);
		
		let firmIds = await Firm.find({ $or:[  
									{ "name": { $regex: regex } },
									{ "licenseNumber": { $regex: regex } },
									{ "note": { $regex: regex } },
								] 
							}).distinct('_id');
		
		userCondition.push({$or: [  
									{ "detail.name": { $regex: regex } },
									{ "detail.phoneNumber": { $regex: regex } },
									{ "email": { $regex: regex }},
									{ "firm": {$in: firmIds} },
								]
							});

	}

	let firmIds = await Firm.find({$and: firmCondition}).distinct('_id').exec();
	
	userCondition.push({firm: {$in: firmIds}});
	userCondition = {$and: userCondition}

	let result = await User.find(userCondition)
				    		.populate('firm')
				    		.sort( { _id : -1 } )
	    			    	.skip(pg.skip)
	    			    	.limit(pg.pageSize)
					    	.exec();

	let total = await User.find(userCondition).countDocuments();
	
	return {
			"pagination": GeneralHelper.makePaginationObject(pg.pageNo,pg.pageSize,pg.skip,total,result.length),
			"data" :result
		};
}

exports.registerFirm = async (firmName,licenseNumber) => {
    
    const firm = new Firm({
        _id          : new mongoose.Types.ObjectId(),
        name       	 : firmName,
        licenseNumber: licenseNumber,
		status  	 : FirmStatus.PENDING
    }); 
    modelFirm = ""; 
    await firm.save()
            .then(result => {
                modelFirm = result;
            })
            .catch(err => {
            	modelFirm =  err;
            });

    return modelFirm;
}

exports.createAdmin = async (email,password,name,phoneNumber,firmId) => {
    
    let detail = {
    	name      	 : name,
		phoneNumber  : phoneNumber,
    };

    const user = new User({
        _id          : new mongoose.Types.ObjectId(),
        email      	 : email.trim().toLowerCase(),
        password     : password,
		role		 : Role.ADMIN,
		firm		 : firmId,
		detail 		 : detail
    }); 
    return await user.save();
}

exports.foundFirmById = async (_id) => {
	return await Firm.findOne({ _id:_id });
}

exports.foundFirm = async (condition) => {
	return await Firm.findOne(condition);
}

exports.foundFirmByName = async (name) => {
	let regex = new RegExp(name.trim(),'i');
	return await Firm.findOne({name: { $regex: regex }, isDeleted:false});
}

exports.updateFirmStatus = async (_id,status,note) => {

	const updateFirmInfo = {
			status 		: status,
			note 		: note
	};

	let result = await Firm.updateOne({_id:_id},{$set:updateFirmInfo});
	return result;
}

exports.updateFirm = async (findObj,setObj) => {
    return await Firm.updateOne(findObj,{$set:setObj});
}

exports.deleteFirms = async (ids) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}

	for(let i=0;i<ids.length;i++){
		await User.updateOne({ firm: ids[i]},{$set: updateInfo}).exec();
		await Firm.updateOne({_id: ids[i]},{$set: updateInfo}).exec();
	}
}


exports.newRegisterations = async () => {
	return await Firm.find({status:FirmStatus.PENDING, isDeleted:false}).countDocuments();
}

exports.totalRegistered = async () => {
	return await Firm.find({status:FirmStatus.APPROVED, isDeleted:false}).countDocuments();
}

exports.registeredThisMonth = async () => {

	let fromDate = moment().startOf('month');
    let toDate 	= moment().endOf('month');

	return await Firm.find({status:FirmStatus.APPROVED, "createdAt": { $gte: fromDate, $lte: toDate }}).countDocuments();
}

exports.registeredThisYear = async () => {

	let fromDate = moment().startOf('year');
    let toDate 	= moment().endOf('year');
	
	return await Firm.find({status:FirmStatus.APPROVED, "createdAt": { $gte: fromDate, $lte: toDate }}).countDocuments();
}


exports.createDefaultDesignations = async (firm) => {

	let designationA = await DesignationHelper.addDesignation(Designation.DEFAULT_TITLE_A,firm);
	let designationB = await DesignationHelper.addDesignation(Designation.DEFAULT_TITLE_B,firm);

}