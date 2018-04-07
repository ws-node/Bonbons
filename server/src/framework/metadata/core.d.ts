import express from "express";
import * as core from "express-serve-static-core";
declare type exp = core.Express;
declare type request = core.Request;
declare type response = core.Response;
export { express as CreateExpress, exp as Express, request as Request, response as Response };
