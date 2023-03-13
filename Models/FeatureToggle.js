const mongoose = require('mongoose');

const featureToggle = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    firmId: [{ type: String, ref: 'Firm', default: null }],
    enabled: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
}, { timestamps: true });

module.exports = mongoose.model('FeatureToggle', featureToggle);