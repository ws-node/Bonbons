"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
class BaseController {
    /**
     * The routes defined in design-time.
     */
    get routes() { return this._routes || (this._routes = []); }
    /**
     * Context for this controller, different request has different context.
     */
    get context() { return this._context; }
    get request() { return this.context.request; }
    get response() { return this.context.response; }
    constructor() { }
}
exports.BaseController = BaseController;
/**
 * Check and edit absolute route path and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(ctrl) {
    ctrl.routes.forEach(route => {
        if (!(route.path || "").startsWith("/")) {
            route.path = ctrl._prefix + route.path;
        }
    });
}
exports.registerCompelete = registerCompelete;
/**
 * Config controller prefix.
 * @param ctrl controller prototype
 * @param prefix
 */
function registerPrefix(ctrl, prefix) {
    ctrl._prefix = ("/" + (prefix || "") + "/").replace("//", "/");
}
exports.registerPrefix = registerPrefix;
/**
 * Create or modify the route config
 * @param ctrl controller prototype
 * @param methodName
 * @param config
 */
function registerRoute(ctrl, methodName, config) {
    const route = ctrl.routes.find(i => i.methodName === methodName);
    if (!route) {
        ctrl.routes.push(Object.assign({ methodName }, config));
    }
    else {
        Object.assign(route, config);
    }
}
exports.registerRoute = registerRoute;
/**
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
function bindContext(ctrl, request, response) {
    ctrl._context = new context_1.ControllerContext(request, response);
    return ctrl;
}
exports.bindContext = bindContext;
//# sourceMappingURL=controller.js.map