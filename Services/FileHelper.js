// Mongoose
const mongoose = require("mongoose");

// Moment
const moment = require('moment');  

// Models
const File = require("../Models/File");
const Project = require("../Models/Project");

// Constants
const ProjectConst      = require("../Constants/Project");

// Helper
const GeneralHelper = require("./GeneralHelper");
const ProjectUserHelper = require("./ProjectUserHelper");


exports.addFile = async (user, path, firm, project=null) => {
    const file = new File({
        _id     : new mongoose.Types.ObjectId(),
        user	: user,
        project	: project,
        path	: path,
        firm    : firm,
    }); 
    return await file.save();
}

exports.listMyFiles = async (firm, pageNo, userId, projects=[], users=[], createdAt, searchValue=null) => {
    let pg = GeneralHelper.getPaginationDetails(pageNo);
    let fileCondition = [{firm: firm},{isDeleted: false}];

    if(projects!=null && projects.length)
    {
        fileCondition.push({ project: {$in: projects} });
    }
    else
    {
        let userProjectIds = await ProjectUserHelper.foundProjectIdsByUser(userId);
        userProjectIds = await Project.find({_id: { $in: userProjectIds }}).distinct('_id');
        
        let nonUserProjectIds = await ProjectUserHelper.foundProjectIdsByNotUser(userId);
        nonUserProjectIds = await Project.find({_id: { $in: nonUserProjectIds }, privacy: ProjectConst.PRIVACY_PUBLIC}).distinct('_id');

        let projectIds = userProjectIds.concat(nonUserProjectIds);
        projectIds.push(null);

        fileCondition.push({ project: {$in: projectIds} });
    }

    if(users!=null && users.length)
    {
        fileCondition.push({ user: {$in: users} });
    }

    if(createdAt!=null)
    {
        let fromDate = moment(createdAt).startOf('day');
        let toDate = moment(createdAt).endOf('day');
        fileCondition.push({ createdAt: { $gte: fromDate, $lte: toDate }});
    }

    if(GeneralHelper.isValueSet(searchValue))
    {
        searchValue = GeneralHelper.escapeLike(searchValue);
        regex = new RegExp(searchValue,'i');

        fileCondition.push({$or: [  
                                { path: { $regex: regex } },
                            ]});
    }

    fileCondition = {$and: fileCondition}

    let result = await File.find(fileCondition)
                            .populate('project')
                            .populate('user')
                            .sort( { _id : -1 } )
                            .skip(pg.skip)
                            .limit(pg.pageSize)
                            .exec();

    let total = await File.find(fileCondition).countDocuments();

    return {
            "pagination":GeneralHelper.makePaginationObject(pg.pageNo,pg.pageSize,pg.skip,total,result.length),
            "data":result
        };
}

exports.listFrimFiles = async (firm, pageNo, projects=[], users=[], createdAt, searchValue=null) => {
    let pg = GeneralHelper.getPaginationDetails(pageNo);
    let fileCondition = [{firm: firm},{isDeleted: false}];

    if(projects!=null && projects.length)
    {
        fileCondition.push({ project: {$in: projects} });
    }

    if(users!=null && users.length)
    {
        fileCondition.push({ user: {$in: users} });
    }

    if(createdAt!=null)
    {
        let fromDate = moment(createdAt).startOf('day');
        let toDate = moment(createdAt).endOf('day');
        fileCondition.push({ createdAt: { $gte: fromDate, $lte: toDate }});
    }

    if(GeneralHelper.isValueSet(searchValue))
    {
        searchValue = GeneralHelper.escapeLike(searchValue);
        regex = new RegExp(searchValue,'i');

        fileCondition.push({$or: [  
                                { path: { $regex: regex } },
                            ]});
    }

    fileCondition = {$and: fileCondition}

    let result = await File.find(fileCondition)
                            .populate('project')
                            .populate('user')
                            .sort( { _id : -1 } )
                            .skip(pg.skip)
                            .limit(pg.pageSize)
                            .exec();

    let total = await File.find(fileCondition).countDocuments();

    return {
            "pagination":GeneralHelper.makePaginationObject(pg.pageNo,pg.pageSize,pg.skip,total,result.length),
            "data":result
        };
}

exports.listProjectFiles = async (project) => {
	return await File.find({ project:project, isDeleted:false });
}

exports.deleteFile = async (_id) => {
    let updateInfo = {
        isDeleted   : true,
        deletedAt   : moment()
    }
    await File.updateOne({_id: _id},{$set: updateInfo}).exec();
}