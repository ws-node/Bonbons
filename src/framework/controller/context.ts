import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";

export type BaseCtor = typeof Number | typeof Boolean | typeof String | typeof Object;

export type IControllerContext = IContext<HttpRequest, HttpResponse>;

export interface IRequestForm {
    data: any;
    get<T>(key: string, type?: T): T;
}

export class HttpRequest {

    /** represent the express req. */
    public get source(): Request { return this._request; }

    private _form: IRequestForm;
    public get form() { return this._form; }

    constructor(private _request: Request) {
        this._form = {
            data: this._request.body,
            get: this._formParam.bind(this)
        };
    }

    /** get query value by key name as <String> */
    public query(key: string): string;
    /** get query value by key name and convert to <Type> */
    public query<T extends BaseCtor>(key: string, type: T): T;
    public query<T extends BaseCtor>(key: string, type?: T): T {
        return convertTo(this._request.query[key] || null, type);
    }

    /** get route param value by key name as <String> */
    public param(key: string): string;
    /** get route param value by key name and convert to <Type> */
    public param<T extends BaseCtor>(key: string, type: T): T;
    public param<T extends BaseCtor>(key: string, type?: T): T {
        return convertTo(this._request.params[key] || null, type);
    }

    private _formParam(key: string): string;
    private _formParam<T extends BaseCtor>(key: string, type: T): T;
    private _formParam<T extends BaseCtor>(key: string, type?: T): T {
        return convertTo((this._request.body && (this._request.body[key])) || null, type);
    }

}

export class HttpResponse {

    /** represent the express rep. */
    public get source(): Response { return this._response; }

    constructor(private _response: Response) { }

}

/**
 * Pack context with the response and request for a controller.
 */
export class ControllerContext implements IControllerContext {

    private _request: HttpRequest;
    public get request() { return this._request; }

    private _response: HttpResponse;
    public get response() { return this._response; }

    public get form() { return this._request.form; }

    constructor(request: Request, response: Response) {
        this._request = new HttpRequest(request);
        this._response = new HttpResponse(response);
    }

    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    public query<T extends BaseCtor>(key: string, type?: T): T {
        return this.request.query(key, <T>type);
    }

    /**
     * Try read a route param from request with key.
     * @param key the route param key
     * @param type the type constructor wanted
     */
    public param<T extends BaseCtor>(key: string, type?: T): T {
        return this.request.param(key, <T>type);
    }

}

function convertTo(value: any, type: any) {
    if (type && value) {
        try {
            return type(value);
        } catch (e) {
            throw new Error(`Type convert failed : can't convert value [${value}] to [${type}]`);
        }
    } else {
        return value;
    }
}