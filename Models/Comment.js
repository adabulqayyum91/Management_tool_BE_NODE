const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text 		: { type: String, required: true },
    project 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null},
    isDeleted 	: { type: Boolean, required:true, default: false },
    deletedAt 	: { type: Date, default: null },
    edited 	: { type: Boolean, required:true, default: false },
},{timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);