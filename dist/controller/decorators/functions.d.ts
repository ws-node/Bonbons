import { BaseController } from "../controller";
import { IMidleware, AllowMethod, IPipe } from "../../metadata/controller";
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
/**
 * Define middleware-pipes for controller or a route. pipe is a ES6 class-stype middleware with more powerful support.
 * @param middlewares pipes list
 * @param merge merge pipes list with controller pipes or not, default is true.
 */
export declare function Pipes(pipes: Array<IPipe>, merge?: boolean): <T extends BaseController | typeof BaseController>(target: any, propertyKey?: string) => void;
