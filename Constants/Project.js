function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Privacy
define("PRIVACY_PUBLIC", "Public");
define("PRIVACY_PRIVATE", "Private");