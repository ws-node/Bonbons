"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const result_1 = require("./result");
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
class BaseController {
    /**
     * Context for this controller, different request has different context.
     */
    get context() { return this._context; }
    constructor() { }
    toJSON(json, options) {
        return new result_1.JsonResult(json, options);
    }
}
exports.BaseController = BaseController;
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