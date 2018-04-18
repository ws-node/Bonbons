import * as express from "express";
import * as core from "express-serve-static-core";
import * as bodyParser from "body-parser";
import * as multer from "multer";

type exp = core.Express;
type application = core.Application;
type request = core.Request;
type response = core.Response;

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
    exp as Express,
    request as Request,
    response as Response,
    bodyParser as BodyParser,
    json as JSONParser,
    raw as RawParser,
    text as TextParser,
    urlencoded as URLEncodedParser,
    multerFn as MultiplePartParser
};
