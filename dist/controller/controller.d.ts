import { IController } from "../metadata/controller";
import { Request, Response } from "../metadata";
import { ControllerContext } from "./context";
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
export declare abstract class BaseController implements IController {
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
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export declare function bindContext<T extends BaseController>(ctrl: T, request: any, response: any): T;
