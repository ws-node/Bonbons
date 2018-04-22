import { Express } from "../metadata/core";
import { ConfigKey, IOptions } from "../metadata/config";
import { BaseController } from "../controller";
export declare class ExpressServer {
    /**
     * Create a new app.
     */
    static Create(): ExpressServer;
    private di;
    private configs;
    private _express;
    /** The reference of express app. You can control this if you really want. */
    readonly app: Express;
    private _listen;
    private _ctrls;
    private readonly staticResolver;
    constructor();
    /**
     * register a controller to application.
     * @param ctrl the constructor of your controller class
     */
    controller<T extends typeof BaseController>(ctrl: any): this;
    private injectable(provide, type);
    private injectable(provide, classType, type?);
    /**
     * Register a scoped service, and scoped services remain unique in each request scope.
     * @param provide the ClassType you want to inject
     */
    scoped(provide: any): ExpressServer;
    /**
     * Register a scoped service, and scoped services remain unique in each request scope.
     * @param provide the abstract class you want to get the injectiton
     * @param classType the ClassType you want to inject
     */
    scoped(provide: any, classType: any): ExpressServer;
    /**
     * Register a singleton service that is unique throughout the application lifecycle.
     * It should be noted that regardless of whether a singleton service's dependencies are singletons or scopes, they will remain unique.
     * @param provide the ClassType you want to inject
     */
    singleton(provide: any): ExpressServer;
    /**
     * Register a singleton service that is unique throughout the application lifecycle.
     * It should be noted that regardless of whether a singleton service's dependencies are singletons or scopes, they will remain unique.
     * @param provide the abstract class you want to get the injectiton
     * @param classType the ClassType you want to inject
     */
    singleton(provide: any, classType: any): ExpressServer;
    /**
     * Add a configuration item for application or modification.
     * It is worth noting that members instantiated from a custom type will replace the old configuration members rather than being merged.
     * @param options IOption<V>
     */
    useOptions<V>(options: IOptions<V>): ExpressServer;
    /**
     * Add a configuration item for application or modification.
     * It is worth noting that members instantiated from a custom type will replace the old configuration members rather than being merged.
     * @param key
     * @param value
     */
    useOptions<V>(key: ConfigKey<V>, value: V): ExpressServer;
    listen(port: number): this;
    run(work: () => void): void;
    private _initDefaultInjections();
    private _initDefaultOptions();
    private _initDefaultMiddlewares();
    private _registerControllers();
    private _createInstance<T>(constor);
    private _registerRoutes<T>(route, constructor, methodName);
    private _selectFuncMethod<T>(method);
    private _parseFuncParams<T>(constructor, req, rep, route);
    private _decideFinalStep<T>(route, middlewares, constructor, methodName);
    private _selectFormParser(route, middlewares);
}
