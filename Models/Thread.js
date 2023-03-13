const mongoose = require('mongoose');

const threadSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    image       : { type: String, default:'default.jpg'},
    title       : { type: String, default:null },
    type        : { type: String, default:'Noraml' },
    project 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default:null},
    userA 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default:null},
    userB 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default:null},
    isDeleted 	: { type: Boolean, required:true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('Thread', threadSchema);