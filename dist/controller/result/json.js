"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../metadata/config");
const type_check_1 = require("../../utils/type-check");
const formater_1 = require("../../utils/formater");
/**
 * Represent the json to send by response.
 */
class JsonResult {
    constructor(json, options) {
        this.json = json;
        this.options = options || {};
    }
    toString(configs) {
        if (configs) {
            this.options = Object.assign(configs.get(config_1.JSON_RESULT_OPTIONS) || {}, this.options);
        }
        const staticResolver = configs.get(config_1.STATIC_TYPED_RESOLVER);
        let json = (staticResolver && staticResolver.ToObject(this.json)) || this.json;
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver, staticResolver);
        }
        return JSON.stringify(json, null, this.options.indentation ? "\t" : 0);
    }
}
exports.JsonResult = JsonResult;
class JsonResultResolvers {
    static decamalize(key) {
        return formater_1.Formater.DeCamelCase(key, "_");
    }
    static camel(key) {
        return formater_1.Formater.ToCamelCase(key);
    }
}
exports.JsonResultResolvers = JsonResultResolvers;
function recursiveResolver(target, resolver, staticRv) {
    let payload = {};
    if (type_check_1.TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver((staticRv && staticRv.ToObject(target[propKey]) || target[propKey]), resolver);
        }
    }
    else if (type_check_1.TypeCheck.IsArray(target)) {
        payload = (target || []).map(i => recursiveResolver((staticRv && staticRv.ToObject(i) || i), resolver));
    }
    else {
        return target;
    }
    return payload;
}
//# sourceMappingURL=json.js.map