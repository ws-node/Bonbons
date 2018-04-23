"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../metadata/reflect");
function getDependencies(target) {
    return Reflect.getMetadata(reflect_1.PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
class ReflectionConstructor {
    GetInjections(target) {
        return getDependencies(target);
    }
    GetControllerMetadata(target) {
        return Reflect.getMetadata(reflect_1.CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, middlewares: [], pipes: [] };
    }
    SetControllerMetadata(target, meta) {
        Reflect.defineMetadata(reflect_1.CTOR_META_KEY, meta, target);
    }
}
exports.ReflectionConstructor = ReflectionConstructor;
exports.Reflection = new ReflectionConstructor();
//# sourceMappingURL=reflect.js.map