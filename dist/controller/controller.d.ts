import { IController, Async, JsonResultOptions, StringResultOptions } from "../metadata/controller";
import { ControllerContext, HttpRequest, HttpResponse } from "./context";
import { JsonResult, StringResult } from "./result";
export declare type IBaseController = IController<HttpRequest, HttpResponse>;
/**
 * Abstract class for controllers. You should always extends this class to create your controller.
 * @abstract
 */
export declare abstract class BaseController implements IBaseController {
    private _context;
    /**
     * Context for this controller, different request has different context.
     * @readonly
     */
    readonly context: ControllerContext;
    constructor();
    /**
     * Returns in JSON format, and supports the use of options to configure serialization behavior
     * @param json object you want to serialize
     * @param options to configure serialization behavior
     */
    protected toJSON(json: any, options?: JsonResultOptions): JsonResult;
    /**
     * Returns the body of a string. You can use the encoding of the options configuration string, etc.
     * @param str string
     * @param options to configure behavior
     */
    protected toStringfy(str: string, options?: StringResultOptions): StringResult;
    /**
     * Let the current execution sleep for a certain period of time
     * @param time
     * @async
     */
    protected sleep(time: number): Async<void>;
}
/**
 * Bind the controller context so that you can access 'this' in all route methods.
 * @param ctrl controller prototype
 * @param request
 * @param response
 */
export declare function bindContext<T extends BaseController>(ctrl: T, request: any, response: any): T;
