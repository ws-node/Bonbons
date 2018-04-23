import { DIContainer } from "../di";
import {
    CreateExpress, Express, BodyParser,
    Response, Request, MultiplePartParser,
    JSONParser, URLEncodedParser, RawParser,
    TextParser
} from "../metadata/core";
import {
    createOptions, ConfigKey, IOptions,
    JSON_RESULT_OPTIONS, BODY_JSON_PARSER, BODY_RAW_PARSER,
    BODY_TEXT_PARSER, BODY_URLENCODED_PARSER, STATIC_TYPED_RESOLVER, STRING_RESULT_OPTIONS, X_POWERED_BY, IConfigContainer
} from "../metadata/config";
import { BaseController, bindContext } from "../controller";
import { InjectScope } from "../metadata/injectable";
import { Extensions } from "./extensions";
import { Reflection } from "../di/reflect";
import { IRoute, IMethodResult, IMidleware, IResult, IStaticTypedResolver, JsonResultOptions, StringResultOptions, FormDcsType } from "../metadata";
import { IBodyParseMetadata } from "../metadata/server";
import { ConfigContainer } from "../config";
import { TypedSerializer } from "../utils/bonbons-serialize";
import { TypeCheck } from "../utils/type-check";
import { NewXPoweredBy } from "../middlewares";

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

    private get staticResolver() { return this.configs.get(STATIC_TYPED_RESOLVER); }

    constructor() {
        this._initDefaultInjections();
        this._initDefaultOptions();
    }

    /**
     * register a controller to application.
     * @param ctrl the constructor of your controller class
     */
    public controller<T extends typeof BaseController>(ctrl: any) {
        if (!ctrl) return this;
        this._ctrls.push(ctrl);
        return this;
    }

    private injectable(provide: any, type: InjectScope): ExpressServer;
    private injectable(provide: any, classType: any, type?: InjectScope): ExpressServer;
    private injectable(provide: any, classType?: any, type?: InjectScope): ExpressServer {
        if (!provide) return this;
        type = type || InjectScope.Singleton;
        this.di.register(provide, classType || provide, type);
        return this;
    }

    /**
     * Register a scoped service, and scoped services remain unique in each request scope.
     * @param provide the ClassType you want to inject
     */
    public scoped(provide: any): ExpressServer;
    /**
     * Register a scoped service, and scoped services remain unique in each request scope.
     * @param provide the abstract class you want to get the injectiton
     * @param classType the ClassType you want to inject
     */
    public scoped(provide: any, classType: any): ExpressServer;
    public scoped(provide: any, classType?: any): ExpressServer {
        return this.injectable(provide, classType, InjectScope.Scoped);
    }

    /**
     * Register a singleton service that is unique throughout the application lifecycle.
     * It should be noted that regardless of whether a singleton service's dependencies are singletons or scopes, they will remain unique.
     * @param provide the ClassType you want to inject
     */
    public singleton(provide: any): ExpressServer;
    /**
     * Register a singleton service that is unique throughout the application lifecycle.
     * It should be noted that regardless of whether a singleton service's dependencies are singletons or scopes, they will remain unique.
     * @param provide the abstract class you want to get the injectiton
     * @param classType the ClassType you want to inject
     */
    public singleton(provide: any, classType: any): ExpressServer;
    public singleton(provide: any, classType?: any): ExpressServer {
        return this.injectable(provide, classType, InjectScope.Singleton);
    }

    /**
     * Add a configuration item for application or modification.
     * It is worth noting that members instantiated from a custom type will replace the old configuration members rather than being merged.
     * @param options IOption<V>
     */
    public useOptions<V>(options: IOptions<V>): ExpressServer;
    /**
     * Add a configuration item for application or modification.
     * It is worth noting that members instantiated from a custom type will replace the old configuration members rather than being merged.
     * @param key
     * @param value
     */
    public useOptions<V>(key: ConfigKey<V>, value: V): ExpressServer;
    public useOptions<V>(...args: (IOptions<V> | ConfigKey<V> | V)[]): ExpressServer {
        const [k, v] = args.length <= 1 ? ([(<any>args).key, (<any>args).value] as [ConfigKey<V>, V]) : ([...args] as [ConfigKey<V>, V]);
        const isFromClass = TypeCheck.isFromCustomClass(v); // check if the v is the instance of a custom class
        this.configs.set(createOptions(k, isFromClass ? v : Object.assign(this.configs.get(k) || {}, v || {})));
        return this;
    }

    public listen(port: number) {
        this._listen = port || 3000;
        return this;
    }

    public run(work: () => void) {
        this.di.complete();
        this._initDefaultMiddlewares();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }

    //#region Private scope

    private _initDefaultInjections() {
        this.singleton(ConfigContainer, this.configs);
    }

    private _initDefaultOptions() {
        this.useOptions(X_POWERED_BY, "Bonbons:1.0.0-beta");
        this.useOptions(STRING_RESULT_OPTIONS, defaultStringResultOptions());
        this.useOptions(JSON_RESULT_OPTIONS, defaultJsonResultOptions());
        this.useOptions(BODY_JSON_PARSER, defaultJsonOptions());
        this.useOptions(BODY_TEXT_PARSER, defaultTextOptions());
        this.useOptions(BODY_RAW_PARSER, defaultRawOptions());
        this.useOptions(BODY_URLENCODED_PARSER, defaultURLEncodedOptions());
        this.useOptions(STATIC_TYPED_RESOLVER, TypedSerializer);
    }

    private _initDefaultMiddlewares() {
        this._express.use(NewXPoweredBy(this.configs.get(X_POWERED_BY)));
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
            const resolver = this.staticResolver;
            querys[route.form.index] = !!(resolver && staticType && staticType.type) ?
                resolver.FromObject(req.body, staticType.type) :
                req.body;
        }
        return { context, params: querys };
    }

    private _decideFinalStep<T extends typeof BaseController>(route: IRoute, middlewares: IMidleware[], constructor: T, methodName: string) {
        middlewares.push((req: Request, rep: Response) => {
            const { context, params } = this._parseFuncParams<T>(constructor, req, rep, route);
            const result: IResult = constructor.prototype[methodName].bind(context)(...params);
            resolveResult(rep, result, this.configs);
        });
    }

    private _selectFormParser(route: IRoute, middlewares: IMidleware[]) {
        if (route.form && route.form.parser) resolveFormParser(middlewares, route, this.configs);
    }

    //#endregion

}

function resolveFormParser(middlewares: IMidleware[], route: IRoute, configs: IConfigContainer) {
    const parser = resolveParser(route.form.parser, configs, route.form.options);
    if (parser) middlewares.unshift(parser);
}

function resolveParser(type: FormDcsType, configs: IConfigContainer, options?: any) {
    switch (type) {
        case FormDcsType.MultipleFormData:
            return MultiplePartParser().any();
        case FormDcsType.ApplicationJson:
            return JSONParser(resolveParserOptions(BODY_JSON_PARSER, configs, options));
        case FormDcsType.UrlEncoded:
            return URLEncodedParser(resolveParserOptions(BODY_URLENCODED_PARSER, configs, options));
        case FormDcsType.Raw:
            return RawParser(resolveParserOptions(BODY_RAW_PARSER, configs, options));
        case FormDcsType.TextPlain:
            return TextParser(resolveParserOptions(BODY_TEXT_PARSER, configs, options));
        default: return null;
    }
}

function resolveParserOptions<T>(key: ConfigKey<T>, configs: IConfigContainer, options?: any): T {
    return Object.assign(configs.get(BODY_JSON_PARSER) || {}, options || {});
}

function resolveResult(rep: Response, result: IResult, configs: IConfigContainer, isSync?: boolean) {
    const isAsync = isSync === undefined ? TypeCheck.isFromCustomClass(result, Promise) : !isSync;
    if (isAsync) {
        (<Promise<IMethodResult>>result).then(r => resolveResult(rep, r, configs, true));
    } else {
        if (!result) { rep.send(null); return; }
        if (typeof result === "string") { rep.send(result); return; }
        rep.send((<IMethodResult>result).toString(configs));
    }
}

function defaultStringResultOptions(): StringResultOptions {
    return { encoding: "utf8", decoding: "utf8" };
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

