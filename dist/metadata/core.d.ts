/// <reference types="body-parser" />
import * as core from "express-serve-static-core";
import * as bodyParser from "body-parser";
import { IContext } from ".";
declare type exp = core.Express;
declare type request = core.Request;
interface Response extends core.Response {
    locals: {
        __context: IContext<any, any>;
        [propName: string]: any;
    };
}
declare const json: typeof bodyParser.json, raw: typeof bodyParser.raw, text: typeof bodyParser.text, urlencoded: typeof bodyParser.urlencoded;
declare const multerFn: () => any;
/**
 * Create a express app.
 */
export declare function CreateExpress(): core.Express;
export { Response, exp as Express, request as Request, bodyParser as BodyParser, json as JSONParser, raw as RawParser, text as TextParser, urlencoded as URLEncodedParser, multerFn as MultiplePartParser };
/** Represents a class's constructor */
export interface IConstructor<T> {
    new (...args: any[]): T;
}
