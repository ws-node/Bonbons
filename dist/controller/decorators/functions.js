"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../../di/reflect");
const base_1 = require("./base");
const reflect_2 = require("../../metadata/reflect");
/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
function Method(...allowMethods) {
    return function (target, propertyKey) {
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { allowMethods }));
    };
}
exports.Method = Method;
/**
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @param {string} path
 * @param {string[]} query provide query params names to open static-injection for query params through method
 */
function Route(path, query) {
    return function (target, propertyKey) {
        const querys = Reflect.getMetadata(reflect_2.PARAMS_META_KEY, target, propertyKey);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        base_1.reroute(reflect, propertyKey, { path, funcParams: [] });
        const route = reflect.router.routes[propertyKey];
        let pcount = 0;
        path.replace(/:([^\/]+)(\/|$)/g, (match, $1) => {
            const type = querys[pcount];
            route.funcParams.push({
                key: $1,
                type: type === Object ? null : type,
                isQuery: false
            });
            pcount += 1;
            return path;
        });
        const queryList = query || [];
        querys.slice(pcount).forEach((q, index) => route.funcParams.push({
            key: (queryList[index] || null),
            type: q === Object ? null : q,
            isQuery: true
        }));
        reflect_1.Reflection.SetControllerMetadata(target, reflect);
    };
}
exports.Route = Route;
/**
 * Define middlewares for controller or a route.
 * @param middlewares middlewares list
 * @param merge merge middlewares list with controller middlewares or not, default is true.
 */
function Middleware(middlewares, merge = true) {
    return function (target, propertyKey) {
        const isConstructor = !!target.prototype;
        const prototype = isConstructor ? target.prototype : target;
        const reflect = reflect_1.Reflection.GetControllerMetadata(prototype);
        if (isConstructor) {
            reflect.middlewares = middlewares;
        }
        else {
            base_1.reroute(reflect, propertyKey, { middleware: { list: middlewares, merge } });
        }
        reflect_1.Reflection.SetControllerMetadata(prototype, reflect);
    };
}
exports.Middleware = Middleware;
//# sourceMappingURL=functions.js.map