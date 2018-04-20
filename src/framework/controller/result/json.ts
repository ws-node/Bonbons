import { IMethodResult } from "../../metadata/controller";
import { IConfigContainer, JSON_RESULT_OPTIONS } from "../../metadata/config";
import { TypedSerializer } from "../../utils/bonbons-serialize";
import { TypeCheck } from "../../utils/type-check";
import { Formater } from "../../utils/formater";

export interface JsonResultResolver {
    (propertyKey: string): string;
}

export interface JsonResultOptions {
    indentation?: boolean;
    resolver?: JsonResultResolver;
    staticType?: boolean;
}

/**
 * Represent the json to send by response.
 */
export class JsonResult implements IMethodResult {

    private options: JsonResultOptions;

    constructor(private json: any, options?: JsonResultOptions) {
        this.options = options || {};
    }

    toString(configs?: IConfigContainer) {
        if (configs) {
            this.options = Object.assign(configs.get(JSON_RESULT_OPTIONS) || {}, this.options);
        }
        let json = TypedSerializer.ToObject(this.json);
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver);
        }
        return JSON.stringify(json, null, this.options.indentation ? "\t" : 0);
    }

}

export class JsonResultResolvers {

    public static decamalize(key: string) {
        return Formater.DeCamelCase(key, "_");
    }

    public static camel(key: string) {
        return Formater.ToCamelCase(key);
    }

}

function recursiveResolver(target: any, resolver: JsonResultResolver) {
    let payload = {};
    if (TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver(TypedSerializer.ToObject(target[propKey]), resolver);
        }
    } else if (TypeCheck.IsArray(target)) {
        payload = (<any[]>target || []).map(i => recursiveResolver(TypedSerializer.ToObject(i), resolver));
    } else {
        return target;
    }
    return payload;
}