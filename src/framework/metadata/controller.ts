import { Request, Response } from "./core";
import { IConfigContainer } from "./config";

export type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

export type ICommonMidleware = (request: Request, response: Response, next?: () => void) => void;
export type IErrorMiddleware = (error: any, request: Request, response: Response, next?: () => void) => void;
export type IMidleware = ICommonMidleware | IErrorMiddleware;

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
    funcParams: Array<{ key: string, type: any, isQuery: boolean }>;
    form: {
        parser: "multiple" | "json" | "url" | "raw" | "text";
        index: number;
        type?: string;
    };
}

export interface IControllerConfig {
    prefix?: string;
}

export interface IMethodResult {
    toString(configs?: IConfigContainer): string;
}

export type IResult = IMethodResult | Async<IMethodResult> | string;

export interface IControllerMetadata {
    router: {
        routes: { [methodName: string]: IRoute }
        prefix?: string;
    };
    middlewares: IMidleware[];
}

export type Async<T> = Promise<T>;
