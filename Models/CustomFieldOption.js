const mongoose = require('mongoose');

const customFieldOptionSchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    title       : { type: String, required: true, default: 'Custom Field' },
    firm 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm'},
    customField : { type: mongoose.Schema.Types.ObjectId, ref: 'CustomField'},
    hide 	: { type: Boolean, default: false },
    isDeleted 	: { type: Boolean, required: true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('CustomFieldOption', customFieldOptionSchema);