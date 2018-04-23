"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const response_1 = require("./response");
__export(require("./request"));
__export(require("./response"));
__export(require("./source"));
/**
 * Pack context with the response and request for a controller.
 */
class ControllerContext {
    get request() { return this._request; }
    get response() { return this._response; }
    get errors() { return this._errors; }
    get locals() { return this._response.locals; }
    get form() { return this._request.form; }
    constructor(request, response, errors) {
        this._request = new request_1.HttpRequest(request);
        this._response = new response_1.HttpResponse(response);
        this._errors = {
            stack: !errors ? [] : [errors],
            add: (error) => this._errors.stack.push(error)
        };
    }
    throws(error) {
        this.errors.stack.push(error);
    }
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query(key, type) {
        return this.request.query(key, type);
    }
    /**
     * Try read a route param from request with key.
     * @param key the route param key
     * @param type the type constructor wanted
     */
    param(key, type) {
        return this.request.param(key, type);
    }
}
exports.ControllerContext = ControllerContext;
//# sourceMappingURL=index.js.map