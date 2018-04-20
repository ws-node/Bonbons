"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpRequest {
    constructor(_request) {
        this._request = _request;
        this._form = {
            data: this._request.body,
            get: this._transform.bind(this, this._request.body)
        };
        this._headers = {
            data: this._request.headers,
            get: this._transform.bind(this, this._request.headers)
        };
    }
    /** represent the express req. */
    get source() { return this._request; }
    get form() { return this._form; }
    get headers() { return this._headers; }
    query(key, type) {
        return convertTo(this._request.query[key] || null, type);
    }
    param(key, type) {
        return convertTo(this._request.params[key] || null, type);
    }
    _transform(source, key, type) {
        return convertTo((source && (source[key])) || null, type);
    }
}
exports.HttpRequest = HttpRequest;
class HttpResponse {
    constructor(_response) {
        this._response = _response;
    }
    /** represent the express rep. */
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
function convertTo(value, type) {
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
//# sourceMappingURL=context.js.map