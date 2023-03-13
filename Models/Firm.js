const mongoose = require('mongoose');

const firmSchema = mongoose.Schema({
    _id 			: mongoose.Schema.Types.ObjectId,
    name 			: { type: String, required: true },
    licenseNumber 	: { type: String},
    status          : { type: String, required: true, enum: ["Pending", "Aprroved", "Rejected"], Default: "Pending" },
    note 			: { type: String, Default: null },
    isDeleted 		: { type: Boolean, required: true, default: false },
    deletedAt 		: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('Firm', firmSchema);