import { IController } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";
import { Request, Response } from "../metadata";
import { ControllerContext } from "./context";
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
export declare abstract class BaseController implements IController {
    protected _prefix: string;
    protected _routes: Array<IRoute>;
    /**
     * The routes defined in design-time.
     */
    readonly routes: IRoute[];
    protected _context: ControllerContext;
    /**
     * Context for this controller, different request has different context.
     */
    readonly context: ControllerContext;
    readonly request: Request;
    readonly response: Response;
    constructor();
}
/**
 * Check and edit absolute route path and all work done.
 * @param ctrl controller prototype
 */
export declare function registerCompelete<T extends BaseController>(ctrl: T): void;
/**
 * Config controller prefix.
 * @param ctrl controller prototype
 * @param prefix
 */
export declare function registerPrefix<T extends BaseController>(ctrl: T, prefix?: string): void;
/**
 * Create or modify the route config
 * @param ctrl controller prototype
 * @param methodName
 * @param config
 */
export declare function registerRoute<T extends BaseController>(ctrl: T, methodName: string, config: any): void;
/**
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export declare function bindContext<T extends BaseController>(ctrl: T, request: any, response: any): T;
