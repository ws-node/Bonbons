import { IController, Async } from "../metadata/controller";
import { ControllerContext, HttpRequest, HttpResponse } from "./context";
import { JsonResultOptions, JsonResult } from "./result";
export declare type IBaseController = IController<HttpRequest, HttpResponse>;
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 */
export declare abstract class BaseController implements IBaseController {
    private _context;
    /**
     * Context for this controller, different request has different context.
     */
    readonly context: ControllerContext;
    constructor();
    protected toJSON(json: any, options?: JsonResultOptions): JsonResult;
    protected sleep(time: number): Async<void>;
}
/**
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export declare function bindContext<T extends BaseController>(ctrl: T, request: any, response: any): T;
