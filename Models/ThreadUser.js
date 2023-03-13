const mongoose = require('mongoose');

const threadUserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('ThreadUser', threadUserSchema);