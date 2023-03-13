const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        // unique: true, 
        // TODO: For futrue use
        // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["Super Admin", "Admin", "Staff", "Client"], required: true, default: "Admin" },
    profileImage: { type: String, default: 'default.jpg' },
    firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
    detail: { type: Object },
    forgotToken: { type: String },
    firstTimeToken: { type: String, default: null },
    forgotTokenTime: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);