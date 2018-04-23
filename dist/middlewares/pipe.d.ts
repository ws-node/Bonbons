import { ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware, Async } from "../metadata/controller";
import { IConfigContainer } from "..";
export declare abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {
    protected isError: boolean;
    protected context: ControllerContext;
    constructor();
    abstract transform(configs: IConfigContainer, context: ControllerContext): void | Async<void>;
    protected throws(error: string): void;
    protected sleep(time: number): Promise<void>;
    toMiddleware(configs: IConfigContainer): IMiddleware;
}
export declare abstract class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor();
    abstract transform(configs: IConfigContainer, context: ControllerContext): void | Async<void>;
}
