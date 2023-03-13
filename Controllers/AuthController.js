// Mongose & Othe Libraries
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");

// Models
const User = require("../Models/User");

// Constants
const Role          = require("../Constants/Role.js");
const FirmStatus    = require("../Constants/FirmStatus.js");
const Message       = require("../Constants/Message.js");
const ResponseCode  = require("../Constants/ResponseCode.js");

// Helpers
const ResponseHelper = require("../Services/ResponseHelper");
const FirmHelper = require("../Services/FirmHelper");
const UserHelper = require("../Services/UserHelper");
const CustomFieldHelper        = require("../Services/CustomFieldHelper");


exports.login = async (req, res, next) => {
    let request = req.body;
    let response = ResponseHelper.getDefaultResponse();
    if(request.socialUser){
        let user = await UserHelper.foundUserByEmail(request.socialUser.email);
        if(user==null)
        {
            response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.USER_NOT_EXIST_SOCIAL);
            return res.status(response.code).json(response);
        }
        let name = await UserHelper.getUserName(user);

        if(user.role==Role.ADMIN)
        {

            let firm = await FirmHelper.foundFirmById(user.firm);
            if(firm.status==FirmStatus.PENDING)
            {
                response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.FIRM_NOT_APPROVED);
                return res.status(response.code).json(response);
            }
        }
        let data = {
            email   : user.email,
            userId  : user._id,
            role    : user.role,
            firmId  : user.firm
        };

        let optional = {};

        if(!request.rememberMe)
            optional['expiresIn'] = "24h";

        const token = jwt.sign(data, process.env.JWT_SECRET, optional);

        Object.assign(user, {name:name});

        let result = {
            _id     : user._id,
            role    : user.role,
            email   : user.email,
            name    : name,
            firmId  : user.firm,
            profileImage : user.profileImage,
        }
        CustomFieldHelper.getCustomFieldWithOptions(user.firm);

        response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.LOGIN_SUCCESS,result);
        // Only For Login API
        response.token = token;
        return res.status(response.code).json(response);
    }else{
        if(!request.email || !request.password)
        {
            response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
            return res.status(response.code).json(response);
        }

        let user = await UserHelper.foundUserByEmail(request.email);

        if(user==null)
        {
            response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.USER_NOT_EXIST);
            return res.status(response.code).json(response);
        }

        let name = await UserHelper.getUserName(user);

        if(user.role==Role.ADMIN)
        {

            let firm = await FirmHelper.foundFirmById(user.firm);
            if(firm.status==FirmStatus.PENDING)
            {
                response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.FIRM_NOT_APPROVED);
                return res.status(response.code).json(response);
            }
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err)
            {
                response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.INVALID_PASSWORD);
                return res.status(response.code).json(response);
            }
            if (result)
            {

                let data = {
                    email   : user.email,
                    userId  : user._id,
                    role    : user.role,
                    firmId  : user.firm
                };

                let optional = {};

                if(!request.rememberMe)
                    optional['expiresIn'] = "24h";

                const token = jwt.sign(data, process.env.JWT_SECRET, optional);

                Object.assign(user, {name:name});

                let result = {
                    _id     : user._id,
                    role    : user.role,
                    email   : user.email,
                    name    : name,
                    firmId  : user.firm,
                    profileImage : user.profileImage,
                }
                CustomFieldHelper.getCustomFieldWithOptions(user.firm);

                response = ResponseHelper.setResponse(ResponseCode.SUCCESS,Message.LOGIN_SUCCESS,result);
                // Only For Login API
                response.token = token;
                return res.status(response.code).json(response);
            }
            response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS,Message.INVALID_PASSWORD);
            return res.status(response.code).json(response);
        });
    }
};