// Libraries
const nodemailer  = require('nodemailer');
const path        = require('path');
const fs          = require('fs');
const handlebars  = require('handlebars');

// Constants
const Message     = require("../Constants/Message.js");


function createTransport() {
    return nodemailer.createTransport({
        host:  process.env.MAIL_HOST,
        secureConnection:  process.env.MAIL_SECURE,
        port:  process.env.MAIL_PORT,
        auth: {
            user:  process.env.MAIL_EMAIL,
            pass:  process.env.MAIL_PASSWORD,
        },
        maxMessages: 50
    });
}


async function verifyTransport(transport) {

	let res;
	await transport.verify(function(error, success) {
     if (error) {
        console.log(error);
        res = error;
    } else {
       res = success;
       console.log('Server is ready to take our messages');
   }
});

    return res;
}

function generateHtmlToSend(fileName,replacements)
{
    const filePath = path.join(__dirname, '../Mails/'+fileName);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    return template(replacements);
}

function setMailOptions(email,subject,fileName,replacements)
{
	return mailOptions = {
        from:  process.env.MAIL_FROM,
        to: email,
        subject: subject,
        html:generateHtmlToSend(fileName,replacements),
    };
}

async function sendEmail(subject,fileName,email,replacements)
{
	var transport = createTransport();
	var transportVerify = await verifyTransport(transport);
	const mailOptions = setMailOptions(email,subject,fileName,replacements);

	await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



function sendNewStaffEmail(email,replacements){
	sendEmail(
     Message.REGISTER_SUCCESS,
     "new-staff.html",
     email,
     replacements);
}

function sendNewClientEmail(email,replacements){
    sendEmail(
        Message.REGISTER_SUCCESS,
        "new-client.html",
        email,
        replacements);
}

function sendForgotPasswordEmail(email,replacements){
    sendEmail(
        Message.RESET_PASSWORD,
        "forgot-password.html",
        email,
        replacements);
}

function sendFirmApprovalEmail(email,replacements){
    sendEmail(
        Message.FIRM_APPROVED,
        "firm-approval.html",
        email,
        replacements);
}

function addedToProjectEmail(email,replacements){
    sendEmail(
        Message.NEW_PROJECT,
        "added-to-project.html",
        email,
        replacements);
}

function addedToTaskEmail(email,replacements){
    sendEmail(
        Message.NEW_TASK,
        "added-to-task.html",
        email,
        replacements);
}

function taskStatusUpdateEmail(email,replacements){
    sendEmail(
        Message.TASK_STATUS_UPDATE,
        "task-status-update.html",
        email,
        replacements);
}

function newCommentEmail(email,replacements){
    sendEmail(
        Message.NEW_COMMENT + replacements.projectName,
        "new-comment-mail.html",
        email,
        replacements);
}

function updateCommentEmail(email,replacements){
    sendEmail(
        Message.UPDATE_COMMENT + replacements.projectName,
        "update-comment-mail.html",
        email,
        replacements);
}

function deleteCommentEmail(email,replacements){
    sendEmail(
        Message.DELETE_COMMENT + replacements.projectName,
        "delete-comment-mail.html",
        email,
        replacements);
}

module.exports = {
  sendNewStaffEmail,
  sendForgotPasswordEmail,
  sendNewClientEmail,
  sendFirmApprovalEmail,
  addedToProjectEmail,
  addedToTaskEmail,
  taskStatusUpdateEmail,
  newCommentEmail,
  updateCommentEmail,
  deleteCommentEmail
}