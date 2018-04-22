import { IMethodResult, IConfigContainer, StringResultOptions } from "./../../metadata";
export declare class StringResult implements IMethodResult {
    private value;
    private options;
    constructor(value: string, options?: StringResultOptions);
    toString(configs: IConfigContainer): string;
}
