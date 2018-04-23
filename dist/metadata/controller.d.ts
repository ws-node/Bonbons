import { Request, Response } from "./core";
import { IConfigContainer } from "./config";
export declare type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export declare enum FormDcsType {
    MultipleFormData = "multiple",
    MultipleFile = "files",
    ApplicationJson = "json",
    UrlEncoded = "url",
    TextPlain = "text",
    Raw = "raw",
}
export declare type ICommonMidleware = (request: Request, response: Response, next?: () => void) => void;
export declare type IErrorMiddleware = (error: any, request: Request, response: Response, next?: () => void) => void;
export declare type IMidleware = ICommonMidleware | IErrorMiddleware;
export declare type IMiddleware = IMidleware;
export interface IMiddlewarePipe<TContext> {
    transform(context: TContext): void;
    toMiddleware(): IMiddleware;
}
export interface IContext<REQ, REP> {
    request: REQ;
    response: REP;
}
export interface IController<REQ, REP> {
    context: IContext<REQ, REP>;
}
/** The route's metadata. */
export interface IRoute {
    path: string;
    allowMethods: AllowMethod[];
    middleware: {
        list: IMidleware[];
        merge: boolean;
    };
    pipes: {
        list: IMiddlewarePipe<any>[];
        merge: boolean;
    };
    funcParams: Array<{
        key: string;
        type: any;
        isQuery: boolean;
    }>;
    form: {
        parser: FormDcsType;
        index: number;
        options?: any;
        type?: string;
    };
}
export interface IControllerConfig {
    prefix?: string;
}
/**
 * Defines the return type of the custom routing method. The custom routing method return type needs to implement this interface
 */
export interface IMethodResult {
    toString(configs: IConfigContainer): string;
}
/** Represents the return type of the controller routing method */
export declare type IResult = IMethodResult | Async<IMethodResult> | string;
/**
 * The controller's metadata. Record some design information that needs to be retrieved at runtime
 */
export interface IControllerMetadata {
    router: {
        routes: {
            [methodName: string]: IRoute;
        };
        prefix?: string;
    };
    middlewares: IMidleware[];
    pipes: IMiddlewarePipe<any>[];
}
/**
 * Represents an asynchronous process and is used as an alias for a Promise
 */
export declare type Async<T> = Promise<T>;
/** Handle JSON keys ,return a new key to replace old one for each.
 * @input old key
 * @output new key
 */
export interface JsonResultResolver {
    (propertyKey: string): string;
}
/**
 * JSON serialization configuration. Provides fine-grained control over the behavior of JsonResult during serialization
 */
export interface JsonResultOptions {
    /** Whether to enable indentation */
    indentation?: boolean;
    /** Handle JSON keys ,return a new key to replace old one for each */
    resolver?: JsonResultResolver;
    /** Whether to enable static type processing according to a serialization contract */
    staticType?: boolean;
}
export interface StringResultOptions {
    encoding?: string;
    decoding?: string;
}
