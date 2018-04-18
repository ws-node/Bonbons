import { Request, Response } from "./core";
export declare type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export declare type ICommonMidleware = (request: Request, response: Response, next?: () => void) => void;
export declare type IErrorMiddleware = (error: any, request: Request, response: Response, next?: () => void) => void;
export declare type IMidleware = ICommonMidleware | IErrorMiddleware;
export interface IContext<REQ, REP> {
    request: REQ;
    response: REP;
}
export interface IController<REQ, REP> {
    context: IContext<REQ, REP>;
}
export interface IRoute {
    path: string;
    allowMethods: AllowMethod[];
    middleware: {
        list: IMidleware[];
        merge: boolean;
    };
    funcParams: Array<{
        key: string;
        type: any;
    }>;
    form: {
        parser: "mutiple" | "json" | "url" | "raw" | "text";
        index: number;
        type?: string;
    };
}
export interface IControllerConfig {
    prefix?: string;
}
export interface IMethodResult {
    toString(): string;
}
export interface IControllerMetadata {
    router: {
        routes: {
            [methodName: string]: IRoute;
        };
        prefix?: string;
    };
    middlewares: IMidleware[];
}
