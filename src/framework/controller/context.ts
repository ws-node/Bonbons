import { Request, Response, IConstructor } from "./../metadata";
import { IContext } from "../metadata/controller";

// tslint:disable-next-line:ban-types
export type BaseCtor = Number | Boolean | String;

export type IControllerContext = IContext<HttpRequest, HttpResponse>;

export interface IConvertable {
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}

export interface IReadable extends IConvertable {
    readonly data: any;
}

export interface IWritable extends IReadable {
    set(key: string, value: any): void;
}

export class ReadableSource implements IReadable {

    public get data() {
        return this._method ?
            this._data[this._method]() :
            (this._data || {});
    }

    constructor(private _data: { [key: string]: any }, private _method?: string) { }

    public get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return this._transform(this.data, key, <IConstructor<T>>type);
    }

    protected _transform(source: any, key: string): string;
    protected _transform<T extends BaseCtor>(source: any, key: string, type: IConstructor<T>): T;
    protected _transform<T extends BaseCtor>(source: any, key: string, type?: IConstructor<T>): T {
        return convertTo((source && (source[key])) || null, type);
    }

}

export class WritableSource extends ReadableSource implements IWritable {

    constructor(_data: { [key: string]: any }, _method?: string) {
        super(_data, _method);
    }

    set(key: string, value: any): void {
        throw new Error("Method not implemented.");
    }

}

export class HttpRequest {

    /** represent the express req. */
    public get source(): Request { return this._request; }

    private _form: IReadable;
    public get form() { return this._form; }

    private _headers: IReadable;
    public get headers() { return this._headers; }

    constructor(private _request: Request) {
        this._form = new ReadableSource(this._request.body);
        this._headers = new ReadableSource(this._request.headers);
    }

    /** get query value by key name as <String> */
    public query(key: string): string;
    /** get query value by key name and convert to <Type> */
    public query<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
    public query<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return convertTo(this._request.query[key] || null, type);
    }

    /** get route param value by key name as <String> */
    public param(key: string): string;
    /** get route param value by key name and convert to <Type> */
    public param<T extends BaseCtor>(key: string, type: IConstructor<T>): T;
    public param<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return convertTo(this._request.params[key] || null, type);
    }

}

export class HttpResponse {

    /** represent the express rep. */
    public get source(): Response { return this._response; }

    private _headers: IWritable;
    public get headers() { return this._headers; }

    constructor(private _response: Response) {
        this._headers = {
            get data() { return Object.assign({}, _response.getHeaders()); },
            get: <T>(key: string, type?: IConstructor<T>) => convertTo(this._headers.data[key] || null, type),
            set: (key: string, value) => this._response.setHeader(key, value)
        };
    }

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