import * as core from "express-serve-static-core";
declare type exp = core.Express;
declare type request = core.Request;
declare type response = core.Response;
declare function CreateExpress(): core.Express;
export { CreateExpress, exp as Express, request as Request, response as Response };
