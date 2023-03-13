const mongoose = require('mongoose');

const groupThreadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image: { type: String, default: 'default.jpg' },
    title: { type: String, default: null },
    chatType: { type: String, default: 'Single' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: new Date() },
}, { timestamps: true });

module.exports = mongoose.model('GroupThread', groupThreadSchema);