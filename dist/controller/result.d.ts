import { IMethodResult } from "../metadata/controller";
import { IConfigContainer } from "./../metadata/config";
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
export declare class JsonResult implements IMethodResult {
    private json;
    private options;
    constructor(json: any, options?: JsonResultOptions);
    toString(configs?: IConfigContainer): string;
}
