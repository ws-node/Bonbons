import { Response, IConstructor } from "../../metadata/core";
import { IWritable } from "./contract";
import { convertTo } from "./source";

export class HttpResponse {

    /** represent the express rep. */
    public get source(): Response { return this._response; }

    private _headers: IWritable;
    public get headers() { return this._headers; }

    private _locals: IWritable;
    public get locals() { return this._locals; }

    constructor(private _response: Response) {
        this._headers = {
            get data() { return Object.assign({}, _response.getHeaders()); },
            get: <T>(key: string, type?: IConstructor<T>) => convertTo(this._headers.data[key] || null, type),
            set: (key: string, value) => this._response.setHeader(key, value)
        };
        this._locals = {
            get data() { return _response.locals || (_response.locals = <any>{}); },
            get: <T>(key: string, type?: IConstructor<T>) => convertTo(this._locals.data[key] || null, type),
            set: (key: string, value) => {
                if (key === "__context") throw new Error("locals rewrite error : can't rewrite the reference of controller context.");
                this._locals.data[key] = value;
            }
        };
    }

}