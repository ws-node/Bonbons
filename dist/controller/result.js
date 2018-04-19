"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../metadata/config");
const type_check_1 = require("../utils/type-check");
const bonbons_serialize_1 = require("../utils/bonbons-serialize");
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
        if (!this.options.type && proto) {
            this.options.type =
                proto.constructor && proto.constructor !== Object ? proto.constructor : null;
        }
    }
    toString(configs) {
        if (configs) {
            this.options = Object.assign(configs.get(config_1.JSON_RESULT_OPTIONS) || {}, this.options);
        }
        let json = !!this.options.type ? bonbons_serialize_1.Serialize(this.json) : this.json;
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver);
        }
        return JSON.stringify(json, null, this.options.indentation ? "\t" : 0);
    }
}
exports.JsonResult = JsonResult;
function recursiveResolver(target, resolver) {
    let payload = {};
    if (type_check_1.TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver(target[propKey], resolver);
        }
    }
    else if (type_check_1.TypeCheck.IsArray(target)) {
        payload = (target || []).map(i => recursiveResolver(i, resolver));
    }
    else {
        return target;
    }
    return payload;
}
//# sourceMappingURL=result.js.map