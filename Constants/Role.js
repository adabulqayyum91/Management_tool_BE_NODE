function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Roles
define("SUPER_ADMIN", "Super Admin");
define("ADMIN", "Admin");
define("STAFF", "Staff");
define("CLIENT", "Client");