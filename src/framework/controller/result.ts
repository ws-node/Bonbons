import { IMethodResult } from "../metadata/controller";

/**
 * Represent the json to send by response.
 */
export class JsonResult implements IMethodResult {
    constructor(private json: any) { }
    toString() { return JSON.stringify(this.json); }
}