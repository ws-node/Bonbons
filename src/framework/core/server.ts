import { DIContainer } from "../di";
import { CreateExpress, Express, BodyParser, Response, Request, MultiplePartParser, JSONParser, URLEncodedParser, RawParser, TextParser } from "../metadata/core";
import { BaseController, bindContext } from "../controller";
import { InjectScope } from "../metadata/injectable";
import { Extensions } from "./extensions";
import { Reflection } from "../di/reflect";
import { IRoute, IMethodResult } from "../metadata";
import { IBonbonsMetadata } from "../metadata/server";

export class ExpressServer {

    /**
     * Create a new app.
     */
    public static Create() { return new ExpressServer(); }

    private container = new DIContainer();

    private _express = CreateExpress();
    /** The reference of express app. You can control this if you really want. */
    public get app(): Express { return this._express; }

    private _listen: number;
    private _ctrls: (typeof BaseController)[] = [];

    private _metadata: IBonbonsMetadata;

    constructor() {
        this._metadata = defaultServerMetadata();
    }

    /**
     * register a controller to application.
     * @param ctrl
     */
    public controller<T extends typeof BaseController>(ctrl: any) {
        if (!ctrl) return this;
        this._ctrls.push(ctrl);
        return this;
    }

    public injectable(provide?: any, type?: InjectScope): ExpressServer;
    public injectable(provide?: any, classType?: any, type?: InjectScope): ExpressServer;
    public injectable(provide?: any, classType?: any, type?: InjectScope): ExpressServer {
        if (!provide) return this;
        type = type || InjectScope.Singleton;
        this.container.register(provide, classType || provide, type);
        return this;
    }

    public scoped(provide?: any): ExpressServer;
    public scoped(provide?: any, classType?: any): ExpressServer;
    public scoped(provide?: any, classType?: any): ExpressServer {
        return this.injectable(provide, classType, InjectScope.Scoped);
    }

    public singleton(provide?: any): ExpressServer;
    public singleton(provide?: any, classType?: any): ExpressServer;
    public singleton(provide?: any, classType?: any): ExpressServer {
        return this.injectable(provide, classType, InjectScope.Singleton);
    }

    public confJSONConvert(option?: BodyParser.OptionsJson) {
        this._metadata.bodyParseConfig.json = Object.assign(this._metadata.bodyParseConfig.json, option || {});
        return this;
    }

    public confRawConvert(option?: BodyParser.Options) {
        this._metadata.bodyParseConfig.raw = Object.assign(this._metadata.bodyParseConfig.raw, option || {});
        return this;
    }

    public confTextConvert(option?: BodyParser.OptionsText) {
        this._metadata.bodyParseConfig.text = Object.assign(this._metadata.bodyParseConfig.text, option || {});
        return this;
    }

    public confEncodedConvert(option?: BodyParser.OptionsUrlencoded) {
        this._metadata.bodyParseConfig.urlencoded = Object.assign(this._metadata.bodyParseConfig.urlencoded, option || {});
        return this;
    }

    public listen(port: number) {
        this._listen = port || 3000;
        return this;
    }

    public run(work: () => void) {
        this.container.complete();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }

    private _registerControllers() {
        this._ctrls.forEach(ctrl => {
            const reflect = Reflection.GetControllerMetadata(ctrl.prototype);
            console.log(JSON.stringify(reflect));
            const routes = Object.keys(reflect.router.routes).forEach(
                key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }

    private _createInstance<T extends typeof BaseController>(constor: T): BaseController {
        return new (<any>constor)(...this.container.resolveDeps(constor));
    }

    private _registerRoutes<T extends typeof BaseController>(route: IRoute, constructor: T, methodName: string) {
        route.allowMethods.forEach(
            method => {
                let invoke: (...args: any[]) => void;
                switch (method) {
                    case "GET":
                    case "POST":
                    case "PUT":
                    case "DELETE":
                    case "PATCH":
                    case "OPTIONS":
                    case "HEAD": invoke = (...args: any[]) => this._express[method.toLowerCase()](...args); break;
                    default: throw new Error(`invalid REST method registeration : the method [${method}] is not allowed.`);
                }
                if (!route.path) throw new Error(`invalid REST method path : the path of action '${methodName}' is empty.`);
                const middlewares = (route.middleware && route.middleware.list) || [];
                if (route.form && route.form.parser) {
                    switch (route.form.parser) {
                        case "mutiple": middlewares.unshift(MultiplePartParser().any()); break;
                        case "json": middlewares.unshift(JSONParser(this._metadata.bodyParseConfig.json)); break;
                        case "url": middlewares.unshift(URLEncodedParser(this._metadata.bodyParseConfig.urlencoded)); break;
                        case "raw": middlewares.unshift(RawParser(this._metadata.bodyParseConfig.raw)); break;
                        case "text": middlewares.unshift(TextParser(this._metadata.bodyParseConfig.text)); break;
                        default: break;
                    }
                }
                middlewares.push((req: Request, rep: Response) => {
                    const context = bindContext(this._createInstance(constructor), req, rep);
                    const querys = (route.funcParams || []).map(ele => context.context.query(ele.key, ele.type));
                    if (route.form && route.form.index >= 0) {
                        querys[route.form.index] = req.body;
                    }
                    const result: IMethodResult | string = constructor.prototype[methodName].bind(context)(...querys);
                    rep.send(result && result.toString());
                });
                invoke(route.path, ...middlewares);
            });
    }

}

function defaultServerMetadata(): IBonbonsMetadata {
    return {
        bodyParseConfig: {
            json: defaultJsonOptions(),
            raw: defaultRawOptions(),
            text: defaultTextOptions(),
            urlencoded: defaultURLEncodedOptions()
        }
    };
}

function defaultURLEncodedOptions(): BodyParser.OptionsUrlencoded {
    return {
        extended: false,
        inflate: true,
        parameterLimit: 1000,
        type: "application/x-www-form-urlencoded",
        verify: undefined
    };
}

function defaultTextOptions(): BodyParser.OptionsText {
    return {
        defaultCharset: "utf-8",
        inflate: true,
        limit: "10mb",
        type: "text/plain",
        verify: undefined
    };
}

function defaultRawOptions(): BodyParser.Options {
    return {
        inflate: true,
        limit: "10mb",
        type: "application/octet-stream",
        verify: undefined
    };
}

function defaultJsonOptions(): BodyParser.OptionsJson {
    return {
        inflate: true,
        limit: "10mb",
        reviver: undefined,
        strict: true,
        type: "application/json",
        verify: undefined
    };
}

