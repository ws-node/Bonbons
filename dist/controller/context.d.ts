import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";
export declare type BaseCtor = Number | Boolean | String;
export declare type IControllerContext = IContext<HttpRequest, HttpResponse>;
export interface IConstructor<T> {
    new (...args: any[]): T;
}
export interface IConvertable {
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}
export interface IRequestForm extends IConvertable {
    data: any;
}
export interface IHeaders extends IConvertable {
    data: any;
}
export declare class HttpRequest {
    private _request;
    /** represent the express req. */
    readonly source: Request;
    private _form;
    readonly form: IRequestForm;
    private _headers;
    readonly headers: IHeaders;
    constructor(_request: Request);
    /** get query value by key name as <String> */
    query(key: string): string;
    /** get query value by key name and convert to <Type> */
    query<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
    /** get route param value by key name as <String> */
    param(key: string): string;
    /** get route param value by key name and convert to <Type> */
    param<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
    private _transform(source, key);
    private _transform<T>(source, key, type);
}
export declare class HttpResponse {
    private _response;
    /** represent the express rep. */
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
    readonly form: IRequestForm;
    constructor(request: Request, response: Response);
    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    query<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
    /**
     * Try read a route param from request with key.
     * @param key the route param key
     * @param type the type constructor wanted
     */
    param<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}
