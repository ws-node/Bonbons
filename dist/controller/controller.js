"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const result_1 = require("./result");
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 * @abstract
 */
class BaseController {
    /**
     * Context for this controller, different request has different context.
     * @readonly
     */
    get context() { return this._context; }
    constructor() { }
    /**
     * Returns in JSON format, and supports the use of options to configure serialization behavior
     * @param json object you want to serialize
     * @param options to configure serialization behavior
     */
    toJSON(json, options) {
        return new result_1.JsonResult(json, options);
    }
    /**
     * Returns the body of a string. You can use the encoding of the options configuration string, etc.
     * @param str string
     * @param options to configure behavior
     */
    toStringfy(str, options) {
        return new result_1.StringResult(str, options);
    }
    /**
     * Let the current execution sleep for a certain period of time
     * @param time
     * @async
     */
    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time || 0));
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