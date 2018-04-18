import * as express from "express";
import * as core from "express-serve-static-core";

type exp = core.Express;
type application = core.Application;
type request = core.Request;
type response = core.Response;

const expressFn: () => exp = (<any>express).default || express;

function CreateExpress() {
    return expressFn();
}

export {
    CreateExpress,
    exp as Express,
    request as Request,
    response as Response
};
