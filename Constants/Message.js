function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// General Messages
define("REQUEST_SUCCESSFUL", "Request successful.");
define("INVALID_PASSWORD", "Invalid password.");
define("LOGIN_SUCCESS", "You are successfully logged in.");
define("WENT_WRONG", "Something went wrong!");
define("EMAIL_RECEIVED_SHORTLY", "You will receive an email shortly.");
define("MISSING_PARAMETER", "Missing Parameter.");
define("AUTHENTICATION_FAILED", "Authentication Failed!");
define("PERMISSION_DENIED", "You don't have perrmission for this operation!");
define("ALREADY_EXIST", "Already exist!");
define("INVALID_TOKEN", "Invalid Token!");
define("INVALID_USER", "Invalid User!");
define("TOKEN_EXPIRED", "Token Expired!");

// User Messages
define("USER_NOT_EXIST", "User does not exist.");
define("USER_NOT_EXIST_SOCIAL", "User does not exist. Please contact your admin to create an account.");
define("USER_ADDED_SUCCESS", "User was added successfully.");
define("EMAIL_EXIST", "Oops - email already exists.");
define("EMAIL_NOT_EXIST", "Email does not exist.");
define("DUPLICATE_USERNAME_EMAIL", "Duplicate Username or Emails");


// Firm Messages
define("FIRM_NOT_APPROVED", "Your firm is still not approved.");
define("FRIM_EXIST", "Oops - company name already exists.");



// Image Messages
define("IMAGE_UPDATE_SUCCESS", "Image was updated successfully.");
define("IMAGE_UPLOAD_SUCCESS", "Image was uploaded successfully.");
define("IMAGE_REMOVED_SUCCESS", "Image was removed successfully.");


// Designation Messages
define("STAFF_ATTACHED", "Active staff attached to the following designation.");

// Project Type Messages
define("PROJECT_ATTACHED_TO_TYPE", "Active projects attached to the following type.");

// Project Status Messages
define("PROJECT_ATTACHED_TO_STATUS", "Active projects attached to the following status.");


// Project Messages
define("PROJECT_NOT_EXIST", "Project does not exist.");
define("NEW_PROJECT", "New Project.");

define("NEW_COMMENT", "New Comment on project : ");
define("UPDATE_COMMENT", "Updated Comment on project : ");
define("NO_COMMENT_FOUND", "No Comment Found : ");
define("DELETE_COMMENT", "delete Comment on project : ");



// Task Messages
define("NEW_TASK", "New Task.");
define("TASK_STATUS_UPDATE", "Task Status Updated.");

// File Messages
define("FILE_UPDATE_SUCCESS", "File was updated successfully.");
define("FILE_UPLOAD_SUCCESS", "File was uploaded successfully.");
define("FILE_REMOVED_SUCCESS", "File was removed successfully.");


// Email Subjects
define("REGISTER_SUCCESS", "Registration Successful!");
define("RESET_PASSWORD", "Reset Password!");
define("FIRM_APPROVED", "Firm Approved!");