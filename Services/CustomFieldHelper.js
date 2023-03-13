// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const CustomField = require("../Models/CustomField");
const CustomFieldOption = require("../Models/CustomFieldOption");

// Helpers
const GeneralHelper = require("./GeneralHelper");


exports.getCustomFieldWithOptions = async (firm) => {
	
	let condition = [{firm: firm},{isDeleted: false}];
	condition = {$and: condition};

    let customFields = await CustomField.find(condition).exec();
    if(customFields.length==0)
    {
        customFieldA = new CustomField({
            _id     : new mongoose.Types.ObjectId(),
            title	: 'Custom Field A',
            firm	: firm,
        }); 
        await customFieldA.save();

        customFieldB = new CustomField({
            _id     : new mongoose.Types.ObjectId(),
            title   : 'Custom Field B',
            firm    : firm,
        }); 
        await customFieldB.save();
    }
    else if(customFields.length==1)
    {
        customFieldB = new CustomField({
            _id     : new mongoose.Types.ObjectId(),
            title   : 'Custom Field B',
            firm    : firm,
        }); 
        await customFieldB.save();   
    }

    let result = [];

    customFields = await CustomField.find(condition).exec();
    for(let i=0; i<customFields.length; i++)
    {
        let customFieldOption = await CustomFieldOption.find({customField:customFields[i]._id, isDeleted:false}).exec();
        result.push({
            "customField" : customFields[i],
            "customFieldOptions" : customFieldOption,
        });
    }
    return result;
}

exports.addCustomFieldOption = async (title, firm, customField) => {
    const option = new CustomFieldOption({
        _id     : new mongoose.Types.ObjectId(),
        title	: title.trim(),
        firm	: firm,
        customField	: customField,
    }); 
    return await option.save();
}

exports.deleteCustomFieldOption = async (id) => {
	let updateInfo = {
		isDeleted 	: true,
		deletedAt 	: moment()
	}
	await CustomFieldOption.updateOne({_id: id},{$set: updateInfo}).exec();
}

exports.updateCustomField = async (findObj,setObj) => {
    return await CustomField.updateOne(findObj,{$set:setObj});
}

exports.updateCustomFieldOption = async (findObj,setObj) => {
    return await CustomFieldOption.updateOne(findObj,{$set:setObj});
}

exports.foundCustomFieldOptionById = async (_id) => {
	return await CustomFieldOption.findOne({ _id:_id });
}

exports.foundCustomFieldOptionByTitle = async (title,firm, customField) => {
	let regex = new RegExp(title.trim(),'i');
	return await CustomFieldOption.findOne({ title: { $regex: regex }, customField:customField, firm:firm, isDeleted:false });
}


exports.foundCustomFieldOptionByIdAndTitle = async (_id,title) => {
	let regex = new RegExp(title.trim(),'i');
	return await CustomFieldOption.findOne({ _id:_id , title: { $regex: regex } });
}


exports.updateProjectHideStatus = async (id,setObj) => {
	return await CustomField.updateMany({_id:mongoose.Types.ObjectId(id)},{$set:setObj});
}