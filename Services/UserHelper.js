// Mongoose
const mongoose = require("mongoose");

// Models
const User = require("../Models/User");

// Constants
const Role = require("../Constants/Role");

// Helpers
const GeneralHelper = require("./GeneralHelper");


exports.foundUserByEmail = async (email) => {
    return await User.findOne({ email: email.trim().toLowerCase(), isDeleted: false });
}

exports.foundUserById = async (_id) => {
    return await User.findOne({ _id: _id });
}

exports.foundUserByFirmAndRole = async (firm, role) => {
    return await User.findOne({ firm: firm, role: role });
}

exports.findUserIdByRole = async (role) => {
    return await User.find({ role: role }).distinct('_id');
}

exports.updateUser = async (findObj, setObj) => {
    return await User.updateOne(findObj, { $set: setObj });
}

exports.createUser = async (email, password, role, firstTimeToken = null) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role,
        firstTimeToken: firstTimeToken,
    });
    let modelUser;
    await user.save().then(result => {
        modelUser = result;
    })
        .catch(err => {
            modelUser = err;
        });
    return modelUser;
}

exports.totalRegistered = async (role) => {
    return await User.find({ role: role, isDeleted: false }).countDocuments();
}


exports.getUserName = async (user) => {


    if (user.role == Role.ADMIN)
        return user.detail.name;
    else if (user.role == Role.STAFF || user.role == Role.CLIENT)
        return `${user.detail.firstName} ${user.detail.lastName}`
    else
        return Role.SUPER_ADMIN;
}

// List Available Clients & Staff
exports.listAvailableClientStaffInGroups = async (firm, userId) => {

    let staff = await User.find({ firm: firm, _id: { $ne: userId }, role: Role.STAFF, isDeleted: false });
    let client = await User.find({ firm: firm, _id: { $ne: userId }, role: Role.CLIENT, isDeleted: false });
    staff.map((i) => {
        i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        return i;
    });
    client.map((i) => {
        i.detail.fullName = i.detail.firstName + ' ' + i.detail.lastName;
        return i;
    });
    let result = [];

    result.push({ "title": Role.STAFF, list: staff });
    result.push({ "title": Role.CLIENT, list: client });

    return result;
}

exports.listAvailableClientStaff = async (firm, userId) => {

    let users = await User.find({ firm: firm, _id: { $ne: userId }, isDeleted: false });

    return users;
}

exports.filterStaff = async (userIds) => {
    return await User.find({ _id: { $in: userIds }, role: Role.STAFF, isDeleted: false });
}