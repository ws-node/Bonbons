import { IController, IContext } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";
import { Request, Response } from "../metadata";
import { ControllerContext } from "./context";

/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
export abstract class BaseController implements IController {

    protected _prefix: string;
    protected _routes: Array<IRoute>;
    /**
     * The routes defined in design-time.
     */
    public get routes() { return this._routes || (this._routes = []); }

    protected _context: ControllerContext;
    /**
     * Context for this controller, different request has different context.
     */
    public get context(): ControllerContext { return this._context; }

    public get request(): Request { return this.context.request; }
    public get response(): Response { return this.context.response; }

    constructor() { }

}

/**
 * Check and edit absolute route path and all work done.
 * @param ctrl controller prototype
 */
export function registerCompelete<T extends BaseController>(ctrl: T) {
    ctrl.routes.forEach(route => {
        if (!(route.path || "").startsWith("/")) {
            route.path = (<any>ctrl)._prefix + route.path;
        }
    });
}

/**
 * Config controller prefix.
 * @param ctrl controller prototype
 * @param prefix
 */
export function registerPrefix<T extends BaseController>(ctrl: T, prefix?: string) {
    (<any>ctrl)._prefix = ("/" + (prefix || "") + "/").replace("//", "/");
}

/**
 * Create or modify the route config
 * @param ctrl controller prototype
 * @param methodName
 * @param config
 */
export function registerRoute<T extends BaseController>(ctrl: T, methodName: string, config: any) {
    const route = ctrl.routes.find(i => i.methodName === methodName);
    if (!route) {
        ctrl.routes.push(Object.assign({ methodName }, config));
    } else {
        Object.assign(route, config);
    }
}

/**
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export function bindContext<T extends BaseController>(ctrl: T, request, response) {
    (<any>ctrl)._context = new ControllerContext(request, response);
    return ctrl;
}
