import { DIContainer } from "../di";
import {
    CreateExpress, Express, BodyParser,
    Response, Request, MultiplePartParser,
    JSONParser, URLEncodedParser, RawParser,
    TextParser
} from "../metadata/core";
import {
    createOptions, ConfigKey, IOptions,
    JSON_RESULT_OPTIONS, BODY_JSON_PARSE, BODY_RAW_PARSE,
    BODY_TEXT_PARSE, BODY_URLENCODED_PARSE
} from "../metadata/config";
import { BaseController, bindContext, JsonResultOptions } from "../controller";
import { InjectScope } from "../metadata/injectable";
import { Extensions } from "./extensions";
import { Reflection } from "../di/reflect";
import { IRoute, IMethodResult, IMidleware } from "../metadata";
import { IBodyParseMetadata } from "../metadata/server";
import { ConfigContainer } from "../config";
import { TypedSerializer } from "../utils/bonbons-serialize";

export class ExpressServer {

    /**
     * Create a new app.
     */
    public static Create() { return new ExpressServer(); }

    private di = new DIContainer();
    private configs = new ConfigContainer();

    private _express = CreateExpress();
    /** The reference of express app. You can control this if you really want. */
    public get app(): Express { return this._express; }

    private _listen: number;
    private _ctrls: (typeof BaseController)[] = [];

    constructor() {
        this._initDefaultOptions();
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
        this.di.register(provide, classType || provide, type);
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

    /** Change or set options when you want. With IOptions<K,V>. */
    public useOptions<K extends ConfigKey, V>(options: IOptions<K, V>): ExpressServer;
    /** Change or set options when you want. With key and value. */
    public useOptions<K extends ConfigKey, V>(key: K, value: V): ExpressServer;
    public useOptions<K extends ConfigKey, V>(...args: (IOptions<K, V> | K | V)[]): ExpressServer {
        const [k, v] = args.length <= 1 ? ([(<any>args).key, (<any>args).value] as [K, V]) : ([...args] as [K, V]);
        const oldValue = this.configs.get(k) || {};
        this.configs.set(createOptions(k, Object.assign(oldValue, v || {})));
        return this;
    }

    public listen(port: number) {
        this._listen = port || 3000;
        return this;
    }

    public run(work: () => void) {
        this.di.complete();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }

    //#region Private scope

    private _initDefaultOptions() {
        this.useOptions(JSON_RESULT_OPTIONS, defaultJsonResultOptions());
        this.useOptions(BODY_JSON_PARSE, defaultJsonOptions());
        this.useOptions(BODY_TEXT_PARSE, defaultTextOptions());
        this.useOptions(BODY_RAW_PARSE, defaultRawOptions());
        this.useOptions(BODY_URLENCODED_PARSE, defaultURLEncodedOptions());
    }

    private _registerControllers() {
        this._ctrls.forEach(ctrl => {
            const reflect = Reflection.GetControllerMetadata(ctrl.prototype);
            // console.log(JSON.stringify(reflect, null, "\t"));
            const routes = Object.keys(reflect.router.routes).forEach(
                key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }

    private _createInstance<T extends typeof BaseController>(constor: T): BaseController {
        return new (<any>constor)(...this.di.resolveDeps(constor));
    }

    private _registerRoutes<T extends typeof BaseController>(route: IRoute, constructor: T, methodName: string) {
        route.allowMethods.forEach(
            m => {
                if (!route.path) throw new Error(`invalid REST method path : the path of action '${methodName}' is empty.`);
                const invoke: (...args: any[]) => void = this._selectFuncMethod<T>(m);
                const middlewares = (route.middleware && route.middleware.list) || [];
                this._selectFormParser(route, middlewares);
                this._decideFinalStep(route, middlewares, constructor, methodName);
                invoke(route.path, ...middlewares);
            });
    }

    private _selectFuncMethod<T extends typeof BaseController>(method: string) {
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
        return invoke;
    }

    private _parseFuncParams<T extends typeof BaseController>(constructor: T, req: Request, rep: Response, route: IRoute) {
        const context = bindContext(this._createInstance(constructor), req, rep);
        const querys = (route.funcParams || []).map(ele => ele.isQuery ? context.context.query(ele.key, ele.type) : context.context.param(ele.key, ele.type));
        if (route.form && route.form.index >= 0) {
            // when use form decorator for params, try to static-typed and inject to function params list.
            const staticType = (route.funcParams || [])[route.form.index];
            querys[route.form.index] = !!(staticType && staticType.type) ? TypedSerializer.FromObject(req.body, staticType.type) : req.body;
        }
        return { context, params: querys };
    }

    private _decideFinalStep<T extends typeof BaseController>(route: IRoute, middlewares: IMidleware[], constructor: T, methodName: string) {
        middlewares.push((req: Request, rep: Response) => {
            const { context, params } = this._parseFuncParams<T>(constructor, req, rep, route);
            const result: IMethodResult | string = constructor.prototype[methodName].bind(context)(...params);
            if (typeof result === "string") {
                rep.send(result);
            } else {
                rep.send(result && result.toString(this.configs));
            }
        });
    }

    private _selectFormParser(route: IRoute, middlewares: IMidleware[]) {
        if (route.form && route.form.parser) {
            switch (route.form.parser) {
                case "multiple": middlewares.unshift(MultiplePartParser().any()); break;
                case "json": middlewares.unshift(JSONParser(this.configs.get(BODY_JSON_PARSE))); break;
                case "url": middlewares.unshift(URLEncodedParser(this.configs.get(BODY_URLENCODED_PARSE))); break;
                case "raw": middlewares.unshift(RawParser(this.configs.get(BODY_RAW_PARSE))); break;
                case "text": middlewares.unshift(TextParser(this.configs.get(BODY_TEXT_PARSE))); break;
                default: break;
            }
        }
    }

    //#endregion

}

function defaultJsonResultOptions(): JsonResultOptions {
    return { indentation: true, staticType: false };
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

