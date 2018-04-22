"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = require("iconv-lite");
const metadata_1 = require("./../../metadata");
class StringResult {
    constructor(value, options) {
        this.value = value;
        this.options = options || {};
    }
    toString(configs) {
        const options = Object.assign(configs.get(metadata_1.STRING_RESULT_OPTIONS) || {}, this.options || {});
        const from = (options.fromEncoding || "UTF8").toLowerCase();
        const to = (options.toEncoding || "UTF8").toLowerCase();
        console.log(`ENCODING : [ ${from} ] - [ ${to} ]`);
        console.log(this.value);
        console.log(iconv.decode(iconv.encode(this.value, from), to));
        return iconv.decode(iconv.encode(this.value, from), to);
    }
}
exports.StringResult = StringResult;
//# sourceMappingURL=string.js.map