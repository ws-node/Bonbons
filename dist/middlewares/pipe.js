"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./../controller/context");
const type_check_1 = require("../utils/type-check");
/**
 * Errors raised during the use of pipeline middlewares.
 */
class MiddlewareError extends Error {
    constructor(error) {
        super(error);
        this.name = "MiddlewareError";
    }
}
exports.MiddlewareError = MiddlewareError;
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
class MiddlewarePipe {
    constructor() {
        this._isBreak = false;
        /** Indicates whether the error processing pipeline. It is recommended not to be modified */
        this.isError = false;
    }
    /**
     * The pipeline context, passing the sharing within all pipelines, eventually binds the controller method at the end.
     * You can use context to access request and response information and perform all supported operations.
     */
    get context() { return this._context; }
    /**
     * The application's configuration container (read-only), injected when the pipeline is initialized, can be accessed at runtime
     */
    get configs() { return this._configs; }
    /**
     * Indicates whether the pipeline will trigger next behavior. The property is read-only. Break and other methods will set this option,
     * and ultimately decide whether to use the next method.
     *
     * Should not be tasked to change this option, should use the predefined break and other methods to do
     */
    get canNext() { return !this._isBreak; }
    /**
     * Throws an error and passes it to the subsequent error handler. This will skip all subsequent normal pipes
     * @param error error msg
     */
    throws(error) {
        this.context.errors.add(new MiddlewareError(error));
    }
    /**
     * Interrupted pipe continuous call (does not trigger next behavior)
     * @param msg more imformations
     */
    break(msg) {
        this._isBreak = true;
    }
    /** Sleep the current pipe and need to be used with the await syntax */
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time || 0));
    }
    /** Perform a redirect and interrupt the follow-up pipe. No need to perform extra break method. */
    redirect(statuscode, path) {
        this._context.redirect(statuscode, path);
        this.break();
    }
    /**
     * Call this method to generate a native middleware function.
     * This is the code that the framework executes and should not be manually invoked in the logic code.
     * @param configs configs container
     * @param bundle pack the constroctor and params for pipe, will create a new instance when middleware invoked
     */
    toMiddleware(configs, bundle) {
        return (this.isError ? errorNext : canNext)((context) => {
            const pipe = new bundle.target(...bundle.params);
            pipe._context = context;
            pipe._configs = configs;
            return [this.process.bind(pipe)(), pipe];
        });
    }
}
exports.MiddlewarePipe = MiddlewarePipe;
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
class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor() {
        super();
        this.isError = true;
    }
}
exports.ErrorMiddlewarePipe = ErrorMiddlewarePipe;
/**
 * Create a pipe factory
 * ----------
 * Create a pipe factory that can use parameter configuration. Parameters are passed as constructor arguments to the pipeline, taking care of the order
 * @param pipe base pipe constructor
 */
function createPipeBundle(pipe) {
    return (...args) => ({ target: pipe, params: args });
}
exports.createPipeBundle = createPipeBundle;
function errorNext(step) {
    return function (error, req, rep, next) { resolvePipeTransform(req, rep, step, next, error); };
}
function canNext(step) {
    return function (req, rep, next) { resolvePipeTransform(req, rep, step, next); };
}
function throwOrNext(pipe, context, next) {
    const deepth = context.errors.stack.length;
    if (deepth > 0) {
        next && next(context.errors.stack[deepth - 1]);
    }
    else if (pipe.canNext) {
        next && next();
    }
}
function throwAnyway(error, next) {
    next && next(error);
}
function resolvePipeTransform(req, rep, step, next, error) {
    const context = getContext(req, rep, error);
    const [result, pipe] = step(context);
    if (type_check_1.TypeCheck.isFromCustomClass(result || {}, Promise)) {
        result.then(() => throwOrNext(pipe, context, next)).catch(err => throwAnyway(err, next));
    }
    else {
        throwOrNext(pipe, context, next);
    }
}
function getContext(req, rep, errors) {
    if (!rep.locals) {
        rep.locals = {};
    }
    if (rep.locals.__context) {
        if (!!errors)
            rep.locals.__context.errors.stack.push(errors);
        return rep.locals.__context;
    }
    else {
        return rep.locals.__context = new context_1.ControllerContext(req, rep, errors);
    }
}
//# sourceMappingURL=pipe.js.map