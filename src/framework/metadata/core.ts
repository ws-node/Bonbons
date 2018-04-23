import * as express from "express";
import * as core from "express-serve-static-core";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import { IContext } from ".";

type exp = core.Express;
type application = core.Application;
type request = core.Request;

interface Response extends core.Response {
    locals: {
        __context: IContext<any, any>;
        [propName: string]: any;
    };
}

const { json, raw, text, urlencoded } = bodyParser;

const expressFn: () => exp = (<any>express).default || express;
const multerFn: () => any = multer.default || multer;

/**
 * Create a express app.
 */
export function CreateExpress() {
    return expressFn();
}

export {
    Response,
    exp as Express,
    request as Request,
    bodyParser as BodyParser,
    json as JSONParser,
    raw as RawParser,
    text as TextParser,
    urlencoded as URLEncodedParser,
    multerFn as MultiplePartParser
};

/** Represents a class's constructor */
export interface IConstructor<T> {
    new(...args: any[]): T;
}
