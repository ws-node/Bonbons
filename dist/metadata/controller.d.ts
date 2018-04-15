import { Request, Response } from "./core";
export declare type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export declare type IMidleware = (request: Request, response: Response, next?: () => void) => void;
export interface IContext {
    request: Request;
    response: Response;
}
export interface IController {
    context: IContext;
    request: Request;
    response: Response;
}
export interface IRoute {
    path: string;
    allowMethods: AllowMethod[];
    middleware: {
        list: IMidleware[];
        merge: boolean;
    };
    queryParams: Array<{
        key: string;
        type: any;
    }>;
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
