function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Type
define("TYPE_PROJECT", "Project");
define("TYPE_TASK", "Task");
define("TYPE_SUB_TASK", "Sub Task");
define("TYPE_FILE", "File");
define("TYPE_STAFF", "Staff");
define("TYPE_CLIENT", "Client");
define("TYPE_USER", "User");
define("TYPE_COMMENT", "Comment");


// Recent Limit
define("RECENT_LIMIT", 5);