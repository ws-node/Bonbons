import { ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware, Async, IPipe, IPipeFactory, IPipeBundle } from "../metadata/controller";
import { IConfigContainer } from "..";
/**
 * Errors raised during the use of pipeline middlewares.
 */
export declare class MiddlewareError extends Error {
    name: string;
    constructor(error: string);
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
export declare abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {
    private _isBreak;
    private _context;
    private _configs;
    /** Indicates whether the error processing pipeline. It is recommended not to be modified */
    protected isError: boolean;
    /**
     * The pipeline context, passing the sharing within all pipelines, eventually binds the controller method at the end.
     * You can use context to access request and response information and perform all supported operations.
     */
    protected readonly context: ControllerContext;
    /**
     * The application's configuration container (read-only), injected when the pipeline is initialized, can be accessed at runtime
     */
    protected readonly configs: IConfigContainer;
    /**
     * Indicates whether the pipeline will trigger next behavior. The property is read-only. Break and other methods will set this option,
     * and ultimately decide whether to use the next method.
     *
     * Should not be tasked to change this option, should use the predefined break and other methods to do
     */
    readonly canNext: boolean;
    constructor();
    /**
     * The core functional methods of the pipeline need to be implemented.
     * @todo should be implemented
     */
    abstract process(): void | Async<void>;
    /**
     * Throws an error and passes it to the subsequent error handler. This will skip all subsequent normal pipes
     * @param error error msg
     */
    protected throws(error: string): void;
    /**
     * Interrupted pipe continuous call (does not trigger next behavior)
     * @param msg more imformations
     */
    protected break(msg?: any): void;
    /** Sleep the current pipe and need to be used with the await syntax */
    protected sleep(time: number): Promise<void>;
    /** Perform a redirect and interrupt the follow-up pipe. No need to perform extra break method. */
    protected redirect(statuscode: number, path: string): void;
    /**
     * Call this method to generate a native middleware function.
     * This is the code that the framework executes and should not be manually invoked in the logic code.
     * @param configs configs container
     * @param bundle pack the constroctor and params for pipe, will create a new instance when middleware invoked
     */
    toMiddleware(configs: IConfigContainer, bundle: IPipeBundle): IMiddleware;
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
export declare abstract class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor();
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
export declare function createPipeBundle(pipe: IPipe): IPipeFactory;
