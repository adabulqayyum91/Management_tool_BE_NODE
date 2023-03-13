const mongoose = require('mongoose');

const groupThreadUserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupThread' },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('GroupThreadUser', groupThreadUserSchema);