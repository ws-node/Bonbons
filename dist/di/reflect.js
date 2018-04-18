"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../metadata/reflect");
function getDependencies(target) {
    return Reflect.getMetadata(reflect_1.PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
class Reflection {
    static GetInjections(target) {
        return getDependencies(target);
    }
    static GetControllerMetadata(target) {
        return Reflect.getMetadata(reflect_1.CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, middlewares: [] };
    }
    static SetControllerMetadata(target, meta) {
        Reflect.defineMetadata(reflect_1.CTOR_META_KEY, meta, target);
    }
}
exports.Reflection = Reflection;
//# sourceMappingURL=reflect.js.map