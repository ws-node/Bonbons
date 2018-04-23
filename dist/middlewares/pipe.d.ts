import { IControllerContext, ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware } from "../metadata/controller";
export declare abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {
    protected canNext: boolean;
    protected hasError: boolean;
    constructor();
    abstract transform(context: ControllerContext): void;
    toMiddleware(): IMiddleware;
}
export declare abstract class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor();
    abstract transform(context: IControllerContext): void;
}
