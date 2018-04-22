import { IContext } from "../../metadata/controller";
import { HttpRequest } from "./request";
import { HttpResponse } from "./response";
import { Request, Response, IConstructor } from "../../metadata/core";
import { BaseCtor, IReadable } from "./contract";

export * from "./contract";
export * from "./request";
export * from "./response";
export * from "./source";

export type IControllerContext = IContext<HttpRequest, HttpResponse>;

/**
 * Pack context with the response and request for a controller.
 */
export class ControllerContext implements IControllerContext {

    private _request: HttpRequest;
    public get request() { return this._request; }

    private _response: HttpResponse;
    public get response() { return this._response; }

    public get form(): IReadable { return this._request.form; }

    constructor(request: Request, response: Response) {
        this._request = new HttpRequest(request);
        this._response = new HttpResponse(response);
    }

    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    public query<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return this.request.query(key, <IConstructor<T>>type);
    }

    /**
     * Try read a route param from request with key.
     * @param key the route param key
     * @param type the type constructor wanted
     */
    public param<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return this.request.param(key, <IConstructor<T>>type);
    }

}
