import { Response } from "../../metadata/core";
import { IWritable } from "./contract";
export declare class HttpResponse {
    private _response;
    /** represent the express rep. */
    readonly source: Response;
    private _headers;
    readonly headers: IWritable;
    private _locals;
    readonly locals: IWritable;
    constructor(_response: Response);
}
