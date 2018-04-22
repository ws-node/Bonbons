"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(target) {
    return Object.prototype.toString.call(target) === "[object Object]";
}
function isArray(target) {
    return Object.prototype.toString.call(target) === "[object Array]";
}
function getPrototypeConstructor(obj) {
    const proto = Object.getPrototypeOf(obj);
    return proto && proto.constructor;
}
function isCustomClassInstance(obj) {
    return getPrototypeConstructor(obj) !== Object;
}
class TypeCheckCreator {
    IsObject(target) { return isObject(target); }
    IsArray(target) { return isArray(target); }
    getClass(target) { return getPrototypeConstructor(target); }
    isFromCustomClass(target) { return isCustomClassInstance(target); }
}
exports.TypeCheckCreator = TypeCheckCreator;
exports.TypeCheck = new TypeCheckCreator();
//# sourceMappingURL=type-check.js.map