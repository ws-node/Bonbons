import { Response, IConstructor } from "../../metadata/core";
import { IWritable } from "./contract";
import { convertTo } from "./source";

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