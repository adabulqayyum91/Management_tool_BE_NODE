function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("OWNER","Owner");
define("PARTICIPANT","Participant");