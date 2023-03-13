// Mongoose
const mongoose = require("mongoose");

// Helper
const ProjectUserHelper = require("./ProjectUserHelper");
const GeneralHelper = require("./GeneralHelper");
const MailHelper = require("./MailHelper");


// Models
const Comment = require("../Models/Comment");
const User = require("../Models/User");


exports.addComment = async (user, text, project) => {
	const comment = new Comment({
		_id     : new mongoose.Types.ObjectId(),
		user	: user,
		project	: project,
		text	: text,
	}); 
	return await comment.save();
}

exports.listCommnets = async (project, isDeleted) => {
	return await Comment.find({ project:project, isDeleted:isDeleted })
		.populate('user')
		.sort({ _id: -1 });
}


exports.sendCommentEmail = async (commentBy, projectName, projectId, comment) => {

	let projectUserArr = await ProjectUserHelper.foundProjectUserIds({project:projectId});

	let commenter = await User.findOne({_id:commentBy, isDeleted:false});
	let link = GeneralHelper.genertateProjectViewPageLink(projectId);
	let assetsPath = GeneralHelper.getBackAppUrl();

	for(let i=0; i<projectUserArr.length; i++)
	{
		let user = await User.findOne({_id:projectUserArr[i], isDeleted:false});
		let commenterName=commenter.detail.firstName && commenter.detail.lastName?commenter.detail.firstName+" "+commenter.detail.lastName:commenter.detail.name;
		if(user != null && user._id != commentBy)
		{
			const replacements = {
				email       : user.email,
				link        : link,
				appName     : process.env.APP_NAME,
				assetsPath  : assetsPath,
				projectName : projectName,
				comment : comment,
				commenterName : `${commenterName}`
			};
			MailHelper.newCommentEmail(user.email,replacements);
		}	
	}
}

exports.updateComment = async (commentId,text) => {
	let foundComment = await Comment.findOne({ _id: commentId });
	if(foundComment){
		foundComment.text = text || foundComment.text;
		foundComment.updatedAt = new Date();
		foundComment.edited = true;
		return await foundComment.save();
	}
	else {
		return null
	}
}
//delete Comment
exports.deleteComment = async (commentId) => {
	let foundComment = await Comment.findOne({ _id: commentId });
	if(foundComment){
		foundComment.isDeleted = true;
		foundComment.updatedAt = new Date();
		return await foundComment.save();
	}
	else {
		return null
	}
}

// send update email comment

exports.sendUpdateCommentEmail = async (commentBy, projectName, projectId, comment,flag) => {

	let projectUserArr = await ProjectUserHelper.foundProjectUserIds({project:projectId});

	let commenter = await User.findOne({_id:commentBy, isDeleted:false});
	let link = GeneralHelper.genertateProjectViewPageLink(projectId);
	let assetsPath = GeneralHelper.getBackAppUrl();

	for(let i=0; i<projectUserArr.length; i++)
	{
		let user = await User.findOne({_id:projectUserArr[i], isDeleted:false});
		let commenterName=commenter.detail.firstName && commenter.detail.lastName?commenter.detail.firstName+" "+commenter.detail.lastName:commenter.detail.name;
		if(user != null && user._id != commentBy)
		{
			const replacements = {
				email       : user.email,
				link        : link,
				appName     : process.env.APP_NAME,
				assetsPath  : assetsPath,
				projectName : projectName,
				comment : comment,
				commenterName : `${commenterName}`
			};
			if(flag==="UPDATE"){
				MailHelper.updateCommentEmail(user.email,replacements);
			}
			else{
				MailHelper.deleteCommentEmail(user.email,replacements);
			}
		}	
	}
}