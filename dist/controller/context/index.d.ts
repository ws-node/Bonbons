import { IContext, IContextErrors } from "../../metadata/controller";
import { HttpRequest } from "./request";
import { HttpResponse } from "./response";
import { Request, Response, IConstructor } from "../../metadata/core";
import { BaseCtor, IReadable, IWritable } from "./contract";
export * from "./contract";
export * from "./request";
export * from "./response";
export * from "./source";
export declare type IControllerContext = IContext<HttpRequest, HttpResponse>;
/**
 * Pack context with the response and request for a controller.
 */
export declare class ControllerContext implements IControllerContext {
    private _request;
    readonly request: HttpRequest;
    private _response;
    readonly response: HttpResponse;
    private _errors;
    readonly errors: IContextErrors;
    readonly locals: IWritable;
    readonly form: IReadable;
    constructor(request: Request, response: Response, errors?: any);
    throws(error: any): void;
    redirect(path: string): any;
    redirect(statuscode: number, path: string): any;
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
