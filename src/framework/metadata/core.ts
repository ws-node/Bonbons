import express from "express";
import * as core from "express-serve-static-core";

type exp = core.Express;
type application = core.Application;
type request = core.Request;
type response = core.Response;

export {
    express as CreateExpress,
    exp as Express,
    request as Request,
    response as Response
};
