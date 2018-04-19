"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(target) {
    return Object.prototype.toString.call(target) === "[object Object]";
}
function isArray(target) {
    return Object.prototype.toString.call(target) === "[object Array]";
}
class TypeCheck {
    static IsObject(target) { return isObject(target); }
    static IsArray(target) { return isArray(target); }
}
exports.TypeCheck = TypeCheck;
//# sourceMappingURL=type-check.js.map