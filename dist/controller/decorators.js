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
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @param {string} path
 * @param {string[]} query provide query params names to open static-injection for query params through method
 */
function Route(path, query) {
    return function (target, propertyKey) {
        const querys = Reflect.getMetadata(__1.PARAMS_META_KEY, target, propertyKey);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reroute(reflect, propertyKey, { path, funcParams: [] });
        const route = reflect.router.routes[propertyKey];
        const queryList = query || [];
        querys.forEach((q, index) => route.funcParams[index] = { key: (queryList[index] || null), type: q === Object ? null : q });
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
            reroute(reflect, propertyKey, { middleware: { list: middlewares, merge } });
        }
        reflect_1.Reflection.SetControllerMetadata(prototype, reflect);
    };
}
exports.Middleware = Middleware;
function FromForm(type) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "mutiple", index } }));
    };
}
exports.FromForm = FromForm;
function FromBody(config) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "json", index } }));
    };
}
exports.FromBody = FromBody;
function FormURL(config) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "url", index } }));
    };
}
exports.FormURL = FormURL;
function RawBody(config) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "raw", index } }));
    };
}
exports.RawBody = RawBody;
function TextBody(config) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "text", index } }));
    };
}
exports.TextBody = TextBody;
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