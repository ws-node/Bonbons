import { Response, IConstructor } from "../../metadata/core";
import { IWritable } from "./contract";
import { convertTo, WritableSource } from "./source";

export class HttpResponse {

    /** represent the express rep. */
    public get source(): Response { return this._response; }

    private _headers: IWritable;
    public get headers() { return this._headers; }

    private _locals: IWritable;
    public get locals() { return this._locals; }

    constructor(private _response: Response) {
        this._headers = new WritableSource(
            () => Object.assign({}, _response.getHeaders()),
            (key: string, value) => this._response.setHeader(key, value)
        );
        this._locals = new WritableSource(
            _response.locals || (_response.locals = <any>{}),
            (key: string, value) => {
                if (key === "__context") throw new Error("locals rewrite error : can't rewrite the reference of controller context.");
                this._locals.data[key] = value;
            }
        );
    }

    public redirect(path: string);
    public redirect(statuscode: number, path: string);
    public redirect(...args: (string | number)[]) {
        this._response.redirect(<any>args[0], <any>args[1]);
    }

}