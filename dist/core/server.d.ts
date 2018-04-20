import { Express } from "../metadata/core";
import { ConfigKey, IOptions } from "../metadata/config";
import { BaseController } from "../controller";
import { InjectScope } from "../metadata/injectable";
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
    constructor();
    /**
     * register a controller to application.
     * @param ctrl
     */
    controller<T extends typeof BaseController>(ctrl: any): this;
    injectable(provide?: any, type?: InjectScope): ExpressServer;
    injectable(provide?: any, classType?: any, type?: InjectScope): ExpressServer;
    scoped(provide?: any): ExpressServer;
    scoped(provide?: any, classType?: any): ExpressServer;
    singleton(provide?: any): ExpressServer;
    singleton(provide?: any, classType?: any): ExpressServer;
    /** Change or set options when you want. With IOptions<K,V>. */
    useOptions<K extends ConfigKey, V>(options: IOptions<K, V>): ExpressServer;
    /** Change or set options when you want. With key and value. */
    useOptions<K extends ConfigKey, V>(key: K, value: V): ExpressServer;
    listen(port: number): this;
    run(work: () => void): void;
    private _initDefaultOptions();
    private _registerControllers();
    private _createInstance<T>(constor);
    private _registerRoutes<T>(route, constructor, methodName);
    private _selectFuncMethod<T>(method);
    private _parseFuncParams<T>(constructor, req, rep, route);
    private _decideFinalStep<T>(route, middlewares, constructor, methodName);
    private _selectFormParser(route, middlewares);
}
