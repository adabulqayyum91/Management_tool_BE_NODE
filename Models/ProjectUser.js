const mongoose = require('mongoose');

const projectUserSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    role 		: { type: String, enum: ["Owner", "Participant"], required: true,  default: "Owner" },
    project 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    isDeleted 	: { type: Boolean, required:true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('ProjectUser', projectUserSchema);