function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Default Titles
define("DEFAULT_TITLE_A", "Lawyer");
define("DEFAULT_TITLE_B", "Paralegal");