"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pack context with the response and request for a controller.
 */
class ControllerContext {
    constructor(_request, _response) {
        this._request = _request;
        this._response = _response;
    }
    get request() { return this._request; }
    get response() { return this._response; }
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query(key, type) {
        const value = this.request.query[key] || null;
        if (type && value) {
            try {
                return type(value);
            }
            catch (e) {
                throw new Error(`Type convert failed : can't convert value [${value}] to [${type}]`);
            }
        }
        else {
            return value;
        }
    }
}
exports.ControllerContext = ControllerContext;
//# sourceMappingURL=context.js.map