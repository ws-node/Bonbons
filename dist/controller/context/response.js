"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
class HttpResponse {
    constructor(_response) {
        this._response = _response;
        this._headers = new source_1.WritableSource(() => Object.assign({}, _response.getHeaders()), (key, value) => this._response.setHeader(key, value));
        this._locals = new source_1.WritableSource(_response.locals || (_response.locals = {}), (key, value) => {
            if (key === "__context")
                throw new Error("locals rewrite error : can't rewrite the reference of controller context.");
            this._locals.data[key] = value;
        });
    }
    /** represent the express rep. */
    get source() { return this._response; }
    get headers() { return this._headers; }
    get locals() { return this._locals; }
    redirect(...args) {
        this._response.redirect(args[0], args[1]);
    }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=response.js.map