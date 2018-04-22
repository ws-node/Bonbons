import { IMethodResult, JsonResultOptions, JsonResultResolver } from "../../metadata/controller";
import { IConfigContainer, JSON_RESULT_OPTIONS, STATIC_TYPED_RESOLVER } from "../../metadata/config";
import { TypeCheck } from "../../utils/type-check";
import { Formater } from "../../utils/formater";
import { IStaticTypedResolver } from "../..";

/**
 * Represent the json to send by response.
 */
export class JsonResult implements IMethodResult {

    private options: JsonResultOptions;

    constructor(private json: any, options?: JsonResultOptions) {
        this.options = options || {};
    }

    toString(configs: IConfigContainer) {
        if (configs) {
            this.options = Object.assign(configs.get(JSON_RESULT_OPTIONS) || {}, this.options);
        }
        const staticResolver = configs.get(STATIC_TYPED_RESOLVER) as IStaticTypedResolver;
        let json = (staticResolver && staticResolver.ToObject(this.json)) || this.json;
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver, staticResolver);
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

function recursiveResolver(target: any, resolver: JsonResultResolver, staticRv?: IStaticTypedResolver) {
    let payload = {};
    if (TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver((staticRv && staticRv.ToObject(target[propKey]) || target[propKey]), resolver);
        }
    } else if (TypeCheck.IsArray(target)) {
        payload = (<any[]>target || []).map(i => recursiveResolver((staticRv && staticRv.ToObject(i) || i), resolver));
    } else {
        return target;
    }
    return payload;
}