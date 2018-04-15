import { Request, Response } from "./core";
export declare type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export interface IContext {
    request: Request;
    response: Response;
}
export interface IController {
    context: IContext;
    request: Request;
    response: Response;
    routes: Array<IRoute>;
}
export interface IRoute {
    path?: string;
    methodName: string;
    allowMethods: AllowMethod[];
}
export interface IControllerConfig {
    prefix?: string;
}
export interface IMethodResult {
    toString(): string;
}
