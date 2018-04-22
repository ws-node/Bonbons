import { Request, IConstructor } from "../../metadata/core";
import { IReadable, BaseCtor } from "./contract";
import { ReadableSource, convertTo } from "./source";

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