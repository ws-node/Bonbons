"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const controller_1 = require("./controller");
const reflect_1 = require("../metadata/reflect");
function Controller(config) {
    return function (target) {
        const prototype = target.prototype;
        controller_1.registerPrefix(prototype, typeof config === "string" ? config : config && config.prefix);
        const keys = Reflect.getMetadataKeys(prototype);
        keys.forEach(key => Reflect.getMetadata(key, prototype).forEach(prop => {
            switch (key) {
                case reflect_1.CTOR_METHOD_META_KEY:
                case reflect_1.CTOR_ROUTE_META_KEY:
                    const { propertyKey } = prop, others = __rest(prop, ["propertyKey"]);
                    controller_1.registerRoute(prototype, propertyKey, others);
                    break;
                default: break;
            }
        }));
        controller_1.registerCompelete(prototype);
    };
}
exports.Controller = Controller;
/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
function Method(...allowMethods) {
    return function (target, propertyKey) {
        const values = Reflect.getMetadata(reflect_1.CTOR_METHOD_META_KEY, target) || [];
        values.push({ propertyKey, allowMethods });
        Reflect.defineMetadata(reflect_1.CTOR_METHOD_META_KEY, values, target);
    };
}
exports.Method = Method;
/**
 * Define a method path for a route. absolute or relative path is supported..
 * @param {string} path
 */
function Route(path) {
    return function (target, propertyKey) {
        const values = Reflect.getMetadata(reflect_1.CTOR_ROUTE_META_KEY, target) || [];
        values.push({ propertyKey, path });
        Reflect.defineMetadata(reflect_1.CTOR_ROUTE_META_KEY, values, target);
    };
}
exports.Route = Route;
//# sourceMappingURL=decorators.js.map