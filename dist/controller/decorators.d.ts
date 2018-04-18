/// <reference types="body-parser" />
import "reflect-metadata";
import { AllowMethod, IControllerConfig, IMidleware } from "../metadata/controller";
import { BaseController } from "./controller";
import { BodyParser } from "..";
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config prefix string
 */
export declare function Controller(config?: string): any;
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config an object contains some editable params
 */
export declare function Controller(config?: IControllerConfig): any;
/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
export declare function Method(...allowMethods: AllowMethod[]): <T extends BaseController>(target: T, propertyKey: string) => void;
/**
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @param {string} path
 * @param {string[]} query provide query params names to open static-injection for query params through method
 */
export declare function Route(path: string, query?: string[]): <T extends BaseController>(target: T, propertyKey: string) => void;
/**
 * Define middlewares for controller or a route.
 * @param middlewares middlewares list
 * @param merge merge middlewares list with controller middlewares or not, default is true.
 */
export declare function Middleware(middlewares: Array<IMidleware>, merge?: boolean): <T extends BaseController | typeof BaseController>(target: any, propertyKey?: string) => void;
/** Get form message from body when type is [multiple/form-data] */
export declare function FromForm(): any;
/** Get form message from body when default type is [multiple/form-data] */
export declare function FromForm(type: string): any;
/** Get form message from body when type is [application/json] */
export declare function FromBody(): any;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(type: string): any;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(config: BodyParser.OptionsJson): any;
/** Get form message from body when type is [application/x-www-form-urlencoded] */
export declare function FormURL(): any;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FormURL(type: string): any;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FormURL(config: BodyParser.OptionsUrlencoded): any;
/** Get form message from body when type is [application/octet-stream] */
export declare function RawBody(): any;
/** Get form message from body when default type is [application/octet-stream] */
export declare function RawBody(type: string): any;
/** Get form message from body when default type is [application/octet-stream] */
export declare function RawBody(config: BodyParser.Options): any;
/** Get form message from body when type is [text/plain] */
export declare function TextBody(): any;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(type: string): any;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(config: BodyParser.OptionsText): any;
