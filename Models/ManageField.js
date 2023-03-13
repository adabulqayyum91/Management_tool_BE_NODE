const mongoose = require('mongoose');

const manageFieldSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    tableName 	: { type: String, required: true },
    fields 		: { type: Object, required: true },
    user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});

module.exports = mongoose.model('ManageField', manageFieldSchema);