import { IMethodResult } from "../../metadata/controller";
import { IConfigContainer } from "../../metadata/config";
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
export declare class JsonResult implements IMethodResult {
    private json;
    private options;
    constructor(json: any, options?: JsonResultOptions);
    toString(configs?: IConfigContainer): string;
}
export declare class JsonResultResolvers {
    static decamalize(key: string): any;
    static camel(key: string): any;
}
