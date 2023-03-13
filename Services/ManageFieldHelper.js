const mongoose 		= require("mongoose");
const ManageField 	= require("../Models/ManageField");


exports.list = async (tableName,user) => {
    return await ManageField.findOne({tableName:tableName,user:user}).exec();
};


exports.createOrUpdate = async (fields,tableName,user) => {
    
    let result = await ManageField.findOne({tableName:tableName}).exec();


    if(result)
    {
	    const updateInfo = {
				fields 	: fields,
		};

		result = await ManageField.updateOne({tableName:tableName,user:user},{$set:updateInfo}).exec();	
    }
    else
    {
	    const manageField = new ManageField({
		  	_id 			: new mongoose.Types.ObjectId(),
		  	tableName		: tableName,
		  	fields 			: fields,
		  	user 			: user,
		});

		result = await manageField.save();;
    }
    return result;
};
