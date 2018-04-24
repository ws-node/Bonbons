import { HttpRequest, HttpResponse, IControllerContext, ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware, Async, IPipe, IPipeFactory } from "../metadata/controller";
import { TypeCheck } from "../utils/type-check";
import { IConfigContainer, Response } from "..";

export class MiddlewareError extends Error {
    name = "MiddlewareError";
    constructor(error: string) { super(error); }
}

export abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {

    protected isError = false;
    protected isBreak = false;
    protected context: ControllerContext;
    protected configs: IConfigContainer;

    constructor() { }

    abstract process(): void | Async<void>;

    protected throws(error: string) {
        this.context.errors.add(new MiddlewareError(error));
    }

    protected break(msg?: any) {
        this.isBreak = true;
    }

    protected sleep(time: number) {
        return new Promise<void>(resolve => setTimeout(resolve, time || 0));
    }

    protected redirect(statuscode: number, path: string) {
        this.context.redirect(statuscode, path);
        this.break();
    }

    toMiddleware(configs: IConfigContainer): IMiddleware {
        return (this.isError ? errorNext : canNext)((context: ControllerContext) => {
            this.context = context;
            this.configs = configs;
            this.process.bind(this)();
        });
    }

}

export abstract class ErrorMiddlewarePipe extends MiddlewarePipe {

    constructor() {
        super();
        this.isError = true;
    }

    abstract process(): void | Async<void>;

}

export function createPipeBundle(pipe: IPipe): IPipeFactory {
    return (...args: any[]) => ({ target: pipe, params: args });
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