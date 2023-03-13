const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    matterView: { type: Boolean, default: false },
    meetingView: { type: Boolean, default: false },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    estimatedTime: { type: Number, required: true },
    userEstimatedTime: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    startDate: { type: Date, default: null },
    completedDate: { type: Date, default: null },
    spentTime: { type: Number, default: 0 }, // In seconds
    inProgress: { type: Boolean, default: false },
    status: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    subTasks:[{type: mongoose.Schema.Types.ObjectId, ref: 'SubTask'}]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);