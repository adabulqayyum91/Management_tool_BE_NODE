const mongoose = require('mongoose');

const customFieldSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    title       : { type: String, required: true, default: 'Custom Field' },
    firm 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm'},
    hide 	: { type: Boolean,  default: false },
    isDeleted 	: { type: Boolean, required: true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('CustomField', customFieldSchema);