/// <reference types="body-parser" />
import { Express, BodyParser } from "../metadata/core";
import { BaseController } from "../controller";
import { InjectScope } from "../metadata/injectable";
export declare class ExpressServer {
    /**
     * Create a new app.
     */
    static Create(): ExpressServer;
    private container;
    private _express;
    /** The reference of express app. You can control this if you really want. */
    readonly app: Express;
    private _listen;
    private _ctrls;
    private _metadata;
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
    confJSONConvert(option?: BodyParser.OptionsJson): this;
    confRawConvert(option?: BodyParser.Options): this;
    confTextConvert(option?: BodyParser.OptionsText): this;
    confEncodedConvert(option?: BodyParser.OptionsUrlencoded): this;
    listen(port: number): this;
    run(work: () => void): void;
    private _registerControllers();
    private _createInstance<T>(constor);
    private _registerRoutes<T>(route, constructor, methodName);
}
