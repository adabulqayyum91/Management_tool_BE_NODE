
// Mongoose
const mongoose = require("mongoose");
//Helper
const ResponseHelper = require("../Services/ResponseHelper");

// Constants
const Message = require("../Constants/Message.js");
const ResponseCode = require("../Constants/ResponseCode.js");
const FeatureToggle = require("../Models/FeatureToggle.js");


exports.getProjectView = async (req, res, next) => {

    let request = req.params;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.firmId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let result = await FeatureToggle.findOne({ "firmId": { "$in": request.firmId }, 'name': 'ProjectView' });
    let status = false;
    console.log({ result: result });

    if (result) {
        status = result.enabled
    }
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, status);
    return res.status(response.code).json(response);
};

exports.addInProjectView = async (req, res, next) => {

    let request = req.params;
    let response = ResponseHelper.getDefaultResponse();

    if (!request.firmId) {
        response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.MISSING_PARAMETER);
        return res.status(response.code).json(response);
    }
    let featureToggle = new FeatureToggle({
        _id: new mongoose.Types.ObjectId(),
        "$push": { "$firmId": request.firmId },
        name: 'ProjectView'
    });
    console.log({ featureToggle });
    await featureToggle.save();
    response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.REQUEST_SUCCESSFUL, featureToggle);
    return res.status(response.code).json(response);
};