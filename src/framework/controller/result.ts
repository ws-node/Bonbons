import { IMethodResult } from "../metadata/controller";
import { ConfigKey, IConfigContainer, JSON_RESULT_OPTIONS } from "./../metadata/config";

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
        if (!this.options.type && proto) this.options.type = proto.constructor;
    }

    toString(configs?: IConfigContainer) {
        if (configs) {
            this.options = Object.assign(configs.get(JSON_RESULT_OPTIONS) || {}, this.options);
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