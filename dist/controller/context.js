"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpRequest {
    constructor(_request) {
        this._request = _request;
        this._form = {
            data: this._request.body,
            get: this.formParam.bind(this)
        };
    }
    get source() { return this._request; }
    get form() { return this._form; }
    queryParam(key, type) {
        const value = this._request.query[key] || null;
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
    formParam(key, type) {
        const value = this._request.params[key] || null;
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
exports.HttpRequest = HttpRequest;
class HttpResponse {
    constructor(_response) {
        this._response = _response;
    }
    get source() { return this._response; }
}
exports.HttpResponse = HttpResponse;
/**
 * Pack context with the response and request for a controller.
 */
class ControllerContext {
    get request() { return this._request; }
    get response() { return this._response; }
    get form() { return this._request.form; }
    constructor(request, response) {
        this._request = new HttpRequest(request);
        this._response = new HttpResponse(response);
    }
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query(key, type) {
        return this.request.queryParam(key, type);
    }
}
exports.ControllerContext = ControllerContext;
//# sourceMappingURL=context.js.map