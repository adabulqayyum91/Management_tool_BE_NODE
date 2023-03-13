const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    path 		: { type: String, required: true },
    project 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null},
    firm 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm'},
    isDeleted 	: { type: Boolean, required:true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('File', fileSchema);