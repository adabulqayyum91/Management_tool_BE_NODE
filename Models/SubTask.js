const mongoose = require('mongoose');

const subTaskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    matterView: { type: Boolean, default: false },
    meetingView: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    estimatedTime: { type: Number, required: false },
    userEstimatedTime: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    startDate: { type: Date, default: null },
    completedDate: { type: Date, default: null },
    spentTime: { type: Number, default: 0 }, // In seconds
    inProgress: { type: Boolean, default: false },
    status: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('SubTask', subTaskSchema);