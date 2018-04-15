import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";
export declare type BaseCtor = typeof Number | typeof Boolean | typeof String | typeof Object;
/**
 * Pack context with the response and request for a controller.
 */
export declare class ControllerContext implements IContext {
    private _request;
    private _response;
    readonly request: Request;
    readonly response: Response;
    constructor(_request: Request, _response: Response);
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query(key: string, type?: BaseCtor): any;
}
