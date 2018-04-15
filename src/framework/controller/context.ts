import { Request, Response } from "./../metadata";
import { IContext } from "../metadata/controller";

export type BaseCtor = typeof Number | typeof Boolean | typeof String | typeof Object;

/**
 * Pack context with the response and request for a controller.
 */
export class ControllerContext implements IContext {

    public get request(): Request { return this._request; }
    public get response(): Response { return this._response; }

    constructor(private _request: Request, private _response: Response) { }

    /**
     * Try read a query param from request with key.
     * @param key the query param key
     * @param type the type constructor wanted
     */
    public query(key: string, type?: BaseCtor) {
        const value = this.request.query[key] || null;
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

}