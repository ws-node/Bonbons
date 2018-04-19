/// <reference types="body-parser" />
import { Express, BodyParser } from "../metadata/core";
import { BaseController } from "../controller";
import { InjectScope } from "../metadata/injectable";
import { ConfigKey, IOptions } from "../metadata/config";
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
    /** the metadata for body-parser when nesessary. */
    private parseMeta;
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
    /** Change or set options when you want. With IOptions<K,V>. */
    useOptions<K extends ConfigKey, V>(options: IOptions<K, V>): ExpressServer;
    /** Change or set options when you want. With key and value. */
    useOptions<K extends ConfigKey, V>(key: K, value: V): ExpressServer;
    confEncodedConvert(option?: BodyParser.OptionsUrlencoded): this;
    listen(port: number): this;
    run(work: () => void): void;
    private initDefaultOptions();
    private _registerControllers();
    private _createInstance<T>(constor);
    private _registerRoutes<T>(route, constructor, methodName);
}
