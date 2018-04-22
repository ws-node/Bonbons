import { Request, IConstructor } from "../../metadata/core";
import { IReadable, BaseCtor } from "./contract";
export declare class HttpRequest {
    private _request;
    /** represent the express req. */
    readonly source: Request;
    private _form;
    readonly form: IReadable;
    private _headers;
    readonly headers: IReadable;
    constructor(_request: Request);
    /** get query value by key name as <String> */
    query(key: string): string;
    /** get query value by key name and convert to <Type> */
    query<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
    /** get route param value by key name as <String> */
    param(key: string): string;
    /** get route param value by key name and convert to <Type> */
    param<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
}
