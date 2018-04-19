"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../metadata/config");
/**
 * Represent the json to send by response.
 */
class JsonResult {
    constructor(json, options) {
        this.json = json;
        this.options = options || {};
        if (!json)
            return;
        const proto = Object.getPrototypeOf(json);
        if (!this.options.type && proto)
            this.options.type = proto.constructor;
    }
    toString(configs) {
        if (configs) {
            this.options = Object.assign(configs.get(config_1.JSON_RESULT_OPTIONS) || {}, this.options);
        }
        let json = this.json;
        if (this.options.resolver) {
            const newJson = {};
            const resolver = this.options.resolver;
            Object.keys(this.json || {}).forEach(key => newJson[resolver(key)] = this.json[key]);
            json = newJson;
        }
        return JSON.stringify(json, null, this.options.indentation ? "\t" : 0);
    }
}
exports.JsonResult = JsonResult;
//# sourceMappingURL=result.js.map