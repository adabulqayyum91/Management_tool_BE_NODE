// Helpers
const GeneralHelper     = require("../Services/GeneralHelper");
const ResponseHelper    = require("../Services/ResponseHelper");
const MailHelper        = require("../Services/MailHelper");
const UserHelper        = require("../Services/UserHelper");
const TokenHelper       = require("../Services/TokenHelper");

// Constants
const Message          = require("../Constants/Message.js");
const ResponseCode     = require("../Constants/ResponseCode.js");


exports.forgot = async (req, res, next) => {

	let response = ResponseHelper.getDefaultResponse();
	const request = req.body;

    const foundUser = await UserHelper.foundUserByEmail(request.email);
    if (foundUser==null) 
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.EMAIL_NOT_EXIST);
        return  res.status(response.code).json(response);
    }

    const forgotToken = await TokenHelper.tokenCreater(request.email);
    const FRONT_APP_URL = GeneralHelper.getFrontAppResetUrl();
    const link =  `${FRONT_APP_URL}/${foundUser._id}/${forgotToken}`;
    const BACK_APP_URL = GeneralHelper.getBackAppUrl();
    
    await UserHelper.updateUser({ email:request.email, isDeleted : false },{ 'forgotToken': forgotToken });
    
    const replacements = {
        userName    : foundUser.email,
        link        : link,
        appName     : process.env.APP_NAME,
        mailFrom    : process.env.MAIL_FROM,
        assetsPath  : BACK_APP_URL,
    };

    await MailHelper.sendForgotPasswordEmail(request.email,replacements);

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.EMAIL_RECEIVED_SHORTLY);
	return res.status(response.code).json(response);
};

exports.reset = async (req, res, next) => {
    
	let response = ResponseHelper.getDefaultResponse();
	const request = req.body;

    const id = request.id;
    const token = request.token;

    const password = await GeneralHelper.bcryptPassword(request.password);

	let validResponse;
    await TokenHelper.validationForPasswordChange(req, res, id, token).then(response => {
    	validResponse = response;
    });

    if (validResponse.status === true) 
    {
        await UserHelper.updateUser({ _id:request.id },{ 'password': password, forgotToken:null });
        response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL);
	}
    else
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,validResponse.message);
    }
	return res.status(response.code).json(response);
};

exports.firstTimeUpdate = async (req, res, next) => {
    
    let response = ResponseHelper.getDefaultResponse();
    const request = req.body;

    const id = request.id;
    const token = request.token;

    const password = await GeneralHelper.bcryptPassword(request.password);

    let validResponse;
    await TokenHelper.validationForFirstTimePasswordChange(req, res, id, token).then(response => {
        validResponse = response;
    });

    if (validResponse.status === true) 
    {
        await UserHelper.updateUser({ _id:request.id },{ 'password': password, firstTimeToken:null });
        response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL);
    }
    else
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,validResponse.message);
    }
    return res.status(response.code).json(response);
};

exports.change = async (req, res, next) => {
    let response = ResponseHelper.getDefaultResponse();
    const request = req.body;
    const userId = req.user.userId;
    let user = await UserHelper.foundUserById(userId);
    let matched = await GeneralHelper.comparePassword(request.oldPassword, user.password);
    
    if (!matched) 
    {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.INVALID_PASSWORD);
        return res.status(response.code).json(response);
    }

    const password = await GeneralHelper.bcryptPassword(request.newPassword);;
    await UserHelper.updateUser({ _id:user._id },{password:password});

    response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.REQUEST_SUCCESSFUL);    
    return res.status(response.code).json(response);
};