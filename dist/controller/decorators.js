"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const reflect_1 = require("../di/reflect");
const __1 = require("..");
function Controller(config) {
    return function (target) {
        const prototype = target.prototype;
        const reflect = reflect_1.Reflection.GetControllerMetadata(prototype);
        reflect_1.Reflection.SetControllerMetadata(prototype, registerCompelete(registerPrefix(reflect, config)));
    };
}
exports.Controller = Controller;
/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
function Method(...allowMethods) {
    return function (target, propertyKey) {
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { allowMethods }));
    };
}
exports.Method = Method;
/**
 * Define a method path for a route. absolute or relative path is supported.
 * Declare query params name to use static-typed variable.
 * @param {string} path
 */
function Route(path, query) {
    return function (target, propertyKey) {
        const querys = Reflect.getMetadata(__1.PARAMS_META_KEY, target, propertyKey);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        const routes = reflect.router.routes;
        reroute(reflect, propertyKey, { path, queryParams: [] });
        if (query && query.length > 0) {
            querys.forEach((q, index) => routes[propertyKey].queryParams[index] = { key: query[index], type: q === Object ? String : q });
        }
        reflect_1.Reflection.SetControllerMetadata(target, reflect);
    };
}
exports.Route = Route;
function Middleware(middlewares, merge = true) {
    return function (target, propertyKey) {
        const isConstructor = !!target.prototype;
        const prototype = isConstructor ? target.prototype : target;
        const reflect = reflect_1.Reflection.GetControllerMetadata(prototype);
        if (isConstructor) {
            reflect.middlewares = middlewares;
        }
        else {
            reroute(reflect, propertyKey, { middleware: { list: middlewares, merge } });
        }
        reflect_1.Reflection.SetControllerMetadata(prototype, reflect);
    };
}
exports.Middleware = Middleware;
function initRoutes(reflect, propertyKey) {
    return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = {});
}
function reroute(reflect, propertyKey, payload) {
    Object.assign(initRoutes(reflect, propertyKey), payload);
    return reflect;
}
/**
 * Check and edit absolute route path, merge middlewares and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(meta) {
    Object.keys(meta.router.routes).map(key => meta.router.routes[key]).forEach(route => {
        if (!(route.path || "").startsWith("/")) {
            route.path = meta.router.prefix + route.path;
        }
        if (route.middleware && route.middleware.merge) {
            route.middleware.list = [...meta.middlewares, ...route.middleware.list];
        }
        if (!route.middleware || !route.middleware.merge) {
            route.middleware = { list: [...meta.middlewares], merge: false };
        }
    });
    return meta;
}
/**
 * Config controller prefix.
 * @param ctrl controller prototype
 * @param prefix
 */
function registerPrefix(meta, config) {
    const prefix = typeof config === "string" ? config : config && config.prefix;
    meta.router.prefix = ("/" + (prefix || "") + "/").replace("//", "/");
    return meta;
}
//# sourceMappingURL=decorators.js.map