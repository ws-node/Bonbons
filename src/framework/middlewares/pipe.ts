import { HttpRequest, HttpResponse, IControllerContext, ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware, Async, IPipe, IPipeFactory, IMiddlewareConstroctor, IPipeBundle } from "../metadata/controller";
import { TypeCheck } from "../utils/type-check";
import { IConfigContainer, Response } from "..";

/**
 * Errors raised during the use of pipeline middlewares.
 */
export class MiddlewareError extends Error {
    name = "MiddlewareError";
    constructor(error: string) { super(error); }
}

/**
 * Bonbons Pipe middleware
 * -----------------
 * An ES6 class style middleware component that has more and more powerful extensions than pure function middleware,
 * contains request contexts that can pass access within the pipeline, an injectable configuration container,
 * and can easily customize powerful features .
 *
 * Pipeline middleware supports the introduction of custom parameters,
 * using the factory pattern to build a powerful combination of pipes.
 */
export abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {

    private _isBreak = false;
    private _context: ControllerContext;
    private _configs: IConfigContainer;

    /** Indicates whether the error processing pipeline. It is recommended not to be modified */
    protected isError = false;
    /**
     * The pipeline context, passing the sharing within all pipelines, eventually binds the controller method at the end.
     * You can use context to access request and response information and perform all supported operations.
     */
    protected get context() { return this._context; }
    /**
     * The application's configuration container (read-only), injected when the pipeline is initialized, can be accessed at runtime
     */
    protected get configs() { return this._configs; }

    /**
     * Indicates whether the pipeline will trigger next behavior. The property is read-only. Break and other methods will set this option,
     * and ultimately decide whether to use the next method.
     *
     * Should not be tasked to change this option, should use the predefined break and other methods to do
     */
    public get canNext() { return !this._isBreak; }

    constructor() { }

    /**
     * The core functional methods of the pipeline need to be implemented.
     * @todo should be implemented
     */
    abstract process(): void | Async<void>;

    /**
     * Throws an error and passes it to the subsequent error handler. This will skip all subsequent normal pipes
     * @param error error msg
     */
    protected throws(error: string) {
        this.context.errors.add(new MiddlewareError(error));
    }

    /**
     * Interrupted pipe continuous call (does not trigger next behavior)
     * @param msg more imformations
     */
    protected break(msg?: any) {
        this._isBreak = true;
    }

    /** Sleep the current pipe and need to be used with the await syntax */
    protected sleep(time: number) {
        return new Promise<void>(resolve => setTimeout(resolve, time || 0));
    }

    /** Perform a redirect and interrupt the follow-up pipe. No need to perform extra break method. */
    protected redirect(statuscode: number, path: string) {
        this._context.redirect(statuscode, path);
        this.break();
    }

    /**
     * Call this method to generate a native middleware function.
     * This is the code that the framework executes and should not be manually invoked in the logic code.
     * @param configs configs container
     * @param bundle pack the constroctor and params for pipe, will create a new instance when middleware invoked
     */
    toMiddleware(configs: IConfigContainer, bundle: IPipeBundle): IMiddleware {
        return (this.isError ? errorNext : canNext)((context: ControllerContext) => {
            const pipe: MiddlewarePipe = new bundle.target(...bundle.params) as any;
            pipe._context = context;
            pipe._configs = configs;
            return [this.process.bind(pipe)(), pipe];
        });
    }

}

/**
 * Bonbons Error Pipe
 * -----------------
 * An ES6 class style middleware component that has more and more powerful extensions than pure function middleware,
 * contains request contexts that can pass access within the pipeline, an injectable configuration container,
 * and can easily customize powerful features .
 *
 * Pipeline middleware supports the introduction of custom parameters,
 * using the factory pattern to build a powerful combination of pipes.
 *
 * @extends {MiddlewarePipe}
 */
export abstract class ErrorMiddlewarePipe extends MiddlewarePipe {

    constructor() {
        super();
        this.isError = true;
    }

    /**
     *  The core functional methods of the pipeline need to be implemented.
     * @todo should be implemented
     */
    abstract process(): void | Async<void>;

}

/**
 * Create a pipe factory
 * ----------
 * Create a pipe factory that can use parameter configuration. Parameters are passed as constructor arguments to the pipeline, taking care of the order
 * @param pipe base pipe constructor
 */
export function createPipeBundle(pipe: IPipe): IPipeFactory {
    return (...args: any[]) => ({ target: pipe, params: args });
}

function errorNext(step: (context: ControllerContext) => [void | Async<void>, MiddlewarePipe]) {
    return function (error, req, rep, next) { resolvePipeTransform(req, rep, step, next, error); };
}

function canNext(step: (context: ControllerContext) => [void | Async<void>, MiddlewarePipe]) {
    return function (req, rep, next) { resolvePipeTransform(req, rep, step, next); };
}

function throwOrNext(pipe: MiddlewarePipe, context: ControllerContext, next?) {
    const deepth = context.errors.stack.length;
    if (deepth > 0) {
        next && next(context.errors.stack[deepth - 1]);
    } else if (pipe.canNext) {
        next && next();
    }
}

function throwAnyway(error: any, next?) {
    next && next(error);
}

function resolvePipeTransform(req: any, rep: any, step: (context: ControllerContext) => [void | Async<void>, MiddlewarePipe], next: any, error?: any) {
    const context = getContext(req, rep, error);
    const [result, pipe] = step(context);
    if (TypeCheck.isFromCustomClass(result || {}, Promise)) {
        (<Promise<void>>result).then(() => throwOrNext(pipe, context, next)).catch(err => throwAnyway(err, next));
    } else {
        throwOrNext(pipe, context, next);
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