/// <reference types="body-parser" />
import * as core from "express-serve-static-core";
import * as bodyParser from "body-parser";
declare type exp = core.Express;
declare type request = core.Request;
declare type response = core.Response;
declare const json: typeof bodyParser.json, raw: typeof bodyParser.raw, text: typeof bodyParser.text, urlencoded: typeof bodyParser.urlencoded;
declare const multerFn: () => any;
/**
 * Create a express app.
 */
export declare function CreateExpress(): core.Express;
export { exp as Express, request as Request, response as Response, bodyParser as BodyParser, json as JSONParser, raw as RawParser, text as TextParser, urlencoded as URLEncodedParser, multerFn as MultiplePartParser };
/** Represents a class's constructor */
export interface IConstructor<T> {
    new (...args: any[]): T;
}
