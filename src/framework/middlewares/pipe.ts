import { HttpRequest, HttpResponse, IControllerContext, ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware, Async } from "../metadata/controller";
import { TypeCheck } from "../utils/type-check";
import { IConfigContainer, Response } from "..";

export abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {

    protected isError = false;
    protected context: ControllerContext;

    constructor() { }

    abstract transform(configs: IConfigContainer, context: ControllerContext): void | Async<void>;

    protected throws(error: string) {
        this.context.errors.add(new Error(error));
    }

    protected sleep(time: number) {
        return new Promise<void>(resolve => setTimeout(resolve, time || 0));
    }

    toMiddleware(configs: IConfigContainer): IMiddleware {
        const step = (context: ControllerContext) => {
            this.context = context;
            return this.transform.bind(this, configs)(context);
        };
        return this.isError ? errorNext(step) : canNext(step);
    }

}

export abstract class ErrorMiddlewarePipe extends MiddlewarePipe {

    constructor() {
        super();
        this.isError = true;
    }

    abstract transform(configs: IConfigContainer, context: ControllerContext): void | Async<void>;

}

function errorNext(step: (context: ControllerContext) => void | Async<void>) {
    return function (error, req, rep, next) { resolvePipeTransform(req, rep, step, next, error); };
}

function canNext(step: (context: ControllerContext) => void | Async<void>) {
    return function (req, rep, next) { resolvePipeTransform(req, rep, step, next); };
}

function throwOrNext(context: ControllerContext, next?) {
    const deepth = context.errors.stack.length;
    if (deepth > 0) {
        next && next(context.errors.stack[deepth - 1]);
    } else {
        next && next();
    }
}

function throwAnyway(error: any, next?) {
    next && next(error);
}

function resolvePipeTransform(req: any, rep: any, step: (context: ControllerContext) => void | Promise<void>, next: any, error?: any) {
    const context = getContext(req, rep, error);
    const result = step(context);
    if (TypeCheck.isFromCustomClass(result || {}, Promise)) {
        (<Promise<void>>result).then(() => throwOrNext(context, next)).catch(err => throwAnyway(err, next));
    } else {
        throwOrNext(context, next);
    }
}

function getContext(req: any, rep: Response, errors?: any): ControllerContext {
    if (!rep.locals) { rep.locals = <any>{}; }
    if (rep.locals.__context) {
        if (!!errors) rep.locals.__context.errors.stack.push(errors);
        return <ControllerContext>rep.locals.__context;
    } else {
        return rep.locals.__context = new ControllerContext(req, rep, errors);
    }
}