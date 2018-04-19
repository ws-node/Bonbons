import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";

export type BaseCtor = typeof Number | typeof Boolean | typeof String | typeof Object;

export type IControllerContext = IContext<HttpRequest, HttpResponse>;

export interface IFormData {
    data: any;
    get(key: string, type?: any): any;
}

export class HttpRequest {

    public get source(): Request { return this._request; }

    private _form: IFormData;
    public get form() { return this._form; }

    constructor(private _request: Request) {
        this._form = {
            data: this._request.body,
            get: this.formParam.bind(this)
        };
    }

    public query(key: string): string;
    public query(key: string, type: any): any;
    public query(key: string, type?: any) {
        return convertTo(this._request.query[key] || null, type);
    }

    public param(key: string): string;
    public param(key: string, type: any): any;
    public param(key: string, type?: any) {
        return convertTo(this._request.params[key] || null, type);
    }

    public formParam(key: string): string;
    public formParam(key: string, type: any): any;
    public formParam(key: string, type?: any) {
        return convertTo((this._request.body && (this._request.body[key])) || null, type);
    }

}

export class HttpResponse {

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
    public query(key: string, type?: BaseCtor) {
        return this.request.query(key, type);
    }

    public param(key: string, type?: BaseCtor) {
        return this.request.param(key, type);
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