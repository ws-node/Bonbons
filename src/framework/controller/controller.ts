import { IController, IContext } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";
import { Request, Response } from "../metadata";
import { ControllerContext } from "./context";

/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
export abstract class BaseController implements IController {

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
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export function bindContext<T extends BaseController>(ctrl: T, request, response) {
    (<any>ctrl)._context = new ControllerContext(request, response);
    return ctrl;
}
