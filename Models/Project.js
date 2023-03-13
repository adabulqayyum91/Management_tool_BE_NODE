const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    project: { type: String, required: false, default: "" },
    company: { type: String, required: false, default: "" },
    privacy: { type: String, enum: ["Public", "Private"], required: true, default: "Public" },
    firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectType' },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectStatus' },
    customFieldOption: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomFieldOption', default: null },
    customFieldOption2: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomFieldOption', default: null },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);