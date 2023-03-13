// Helpers
const ManageFieldHelper	= require("../Services/ManageFieldHelper");
const ResponseHelper   	= require("../Services/ResponseHelper");
const GeneralHelper   	= require("../Services/GeneralHelper");

// Constants
const Message 		= require("../Constants/Message.js");
const ResponseCode 	= require("../Constants/ResponseCode.js");

exports.list = async (req, res, next) => {

	let request = req.body;
	let userId = req.user.userId;
  	let response = ResponseHelper.getDefaultResponse();

	if(!request.tableName)
	{
		response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
		return res.status(response.code).json(response);
	}
  	let result = await ManageFieldHelper.list(request.tableName,userId);

  	response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
	return res.status(response.code).json(response);
};


exports.update = async (req, res, next) => {

  	let request = req.body;
	let userId = req.user.userId;
  	let response = ResponseHelper.getDefaultResponse();

	if(!request.tableName || !request.fields)
	{
		response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
		return res.status(response.code).json(response);
	}
	
  	let result = await ManageFieldHelper.createOrUpdate(request.fields, request.tableName, userId);

  	response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, result);
	return res.status(response.code).json(response);
};