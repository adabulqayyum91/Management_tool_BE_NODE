const mongoose = require('mongoose');

const groupMessageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupThread' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, default: null },
    attachment: { type: Array, default: null },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('GroupMessage', groupMessageSchema);