import { IMethodResult } from "../metadata/controller";
import { ConfigKey, IConfigContainer, JSON_RESULT_OPTIONS } from "./../metadata/config";
import { TypeCheck } from "../utils/type-check";
import { Serialize } from "../utils/bonbons-serialize";

export interface JsonResultResolver {
    (propertyKey: string): string;
}

export interface JsonResultOptions {
    type?: any;
    indentation?: boolean;
    resolver?: JsonResultResolver;
}

/**
 * Represent the json to send by response.
 */
export class JsonResult implements IMethodResult {

    private options: JsonResultOptions;

    constructor(private json: any, options?: JsonResultOptions) {
        this.options = options || {};
        if (!json) return;
        const proto = Object.getPrototypeOf(json);
        if (!this.options.type && proto) {
            this.options.type =
                proto.constructor && proto.constructor !== Object ? proto.constructor : null;
        }
    }

    toString(configs?: IConfigContainer) {
        if (configs) {
            this.options = Object.assign(configs.get(JSON_RESULT_OPTIONS) || {}, this.options);
        }
        let json = !!this.options.type ? Serialize(this.json) : this.json;
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver);
        }
        return JSON.stringify(json, null, this.options.indentation ? "\t" : 0);
    }

}

function recursiveResolver(target: any, resolver: JsonResultResolver) {
    let payload = {};
    if (TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver(target[propKey], resolver);
        }
    } else if (TypeCheck.IsArray(target)) {
        payload = (<any[]>target || []).map(i => recursiveResolver(i, resolver));
    } else {
        return target;
    }
    return payload;
}