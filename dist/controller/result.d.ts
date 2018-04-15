import { IMethodResult } from "../metadata/controller";
/**
 * Represent the json to send by response.
 */
export declare class JsonResult implements IMethodResult {
    private json;
    constructor(json: any);
    toString(): string;
}
