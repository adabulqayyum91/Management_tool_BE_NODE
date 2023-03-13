// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const User = require("../Models/User");

// Helpers
const GeneralHelper = require("./GeneralHelper");


exports.profile = async (_id) => {
    return await User.findOne({ _id:_id }).populate('firm');
}