"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
class HttpRequest {
    constructor(_request) {
        this._request = _request;
        this._form = new source_1.ReadableSource(this._request.body);
        this._headers = new source_1.ReadableSource(this._request.headers);
    }
    /** represent the express req. */
    get source() { return this._request; }
    get form() { return this._form; }
    get headers() { return this._headers; }
    query(key, type) {
        return source_1.convertTo(this._request.query[key] || null, type);
    }
    param(key, type) {
        return source_1.convertTo(this._request.params[key] || null, type);
    }
}
exports.HttpRequest = HttpRequest;
//# sourceMappingURL=request.js.map