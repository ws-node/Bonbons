import { IMethodResult } from "../metadata/controller";

export interface JsonResultOptions {
    type?: any;
    indentation?: boolean;
}

/**
 * Represent the json to send by response.
 */
export class JsonResult implements IMethodResult {

    constructor(private json: any, private options?: JsonResultOptions) {
        this.options = this.options || { indentation: true };
        if (!json) return;
        const proto = Object.getPrototypeOf(json);
        if (!this.options.type && proto) this.options.type = proto.constructor;
    }

    toString() {
        return JSON.stringify(this.json, null, this.options.indentation ? "\t" : 0);
    }

}