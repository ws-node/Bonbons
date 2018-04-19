import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";
export declare type BaseCtor = typeof Number | typeof Boolean | typeof String | typeof Object;
export declare type IControllerContext = IContext<HttpRequest, HttpResponse>;
export interface IFormData {
    data: any;
    get(key: string, type?: any): any;
}
export declare class HttpRequest {
    private _request;
    readonly source: Request;
    private _form;
    readonly form: IFormData;
    constructor(_request: Request);
    query(key: string): string;
    query(key: string, type: any): any;
    param(key: string): string;
    param(key: string, type: any): any;
    formParam(key: string): string;
    formParam(key: string, type: any): any;
}
export declare class HttpResponse {
    private _response;
    readonly source: Response;
    constructor(_response: Response);
}
/**
 * Pack context with the response and request for a controller.
 */
export declare class ControllerContext implements IControllerContext {
    private _request;
    readonly request: HttpRequest;
    private _response;
    readonly response: HttpResponse;
    readonly form: IFormData;
    constructor(request: Request, response: Response);
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query(key: string, type?: BaseCtor): any;
    param(key: string, type?: BaseCtor): any;
}
