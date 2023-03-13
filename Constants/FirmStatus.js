function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Status
define("PENDING", "Pending");
define("APPROVED", "Approved");
define("REJECTED", "Rejected");