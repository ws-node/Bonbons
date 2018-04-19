"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../../di/reflect");
function Controller(config) {
    return function (target) {
        const prototype = target.prototype;
        const reflect = reflect_1.Reflection.GetControllerMetadata(prototype);
        reflect_1.Reflection.SetControllerMetadata(prototype, registerCompelete(registerPrefix(reflect, config)));
    };
}
exports.Controller = Controller;
/**
 * Check and edit absolute route path, merge middlewares and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(meta) {
    // console.log(JSON.stringify(meta.router.routes, null, "\t"));
    Object.keys(meta.router.routes).map(key => meta.router.routes[key]).forEach(route => {
        if (!(route.path || "").startsWith("/")) {
            route.path = meta.router.prefix + route.path;
        }
        else if (route.middleware && route.middleware.merge) {
            route.middleware.list = [...meta.middlewares, ...route.middleware.list];
        }
        else if (!route.middleware) {
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
//# sourceMappingURL=main.js.map