"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
class HttpResponse {
    constructor(_response) {
        this._response = _response;
        this._headers = {
            get data() { return Object.assign({}, _response.getHeaders()); },
            get: (key, type) => source_1.convertTo(this._headers.data[key] || null, type),
            set: (key, value) => this._response.setHeader(key, value)
        };
    }
    /** represent the express rep. */
    get source() { return this._response; }
    get headers() { return this._headers; }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=response.js.map