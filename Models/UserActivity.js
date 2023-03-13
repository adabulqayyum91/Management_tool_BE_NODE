const mongoose =require('mongoose');

const userActivitySchema = mongoose.Schema({
    _id 		: mongoose.Schema.Types.ObjectId,
    user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    firm 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm'},
    project 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null},
    type 		: { type: String, required: true },
    text 		: { type: String, required: true },
    isDeleted 	: { type: Boolean, required: true, default: false },
    deletedAt 	: { type: Date, default: null }
},{timestamps: true});

module.exports = mongoose.model('UserActivity', userActivitySchema);