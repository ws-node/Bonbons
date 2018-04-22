"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const core_1 = require("../metadata/core");
const config_1 = require("../metadata/config");
const controller_1 = require("../controller");
const injectable_1 = require("../metadata/injectable");
const reflect_1 = require("../di/reflect");
const config_2 = require("../config");
const bonbons_serialize_1 = require("../utils/bonbons-serialize");
const type_check_1 = require("../utils/type-check");
const middlewares_1 = require("../middlewares");
class ExpressServer {
    constructor() {
        this.di = new di_1.DIContainer();
        this.configs = new config_2.ConfigContainer();
        this._express = core_1.CreateExpress();
        this._ctrls = [];
        this._initDefaultInjections();
        this._initDefaultOptions();
    }
    /**
     * Create a new app.
     */
    static Create() { return new ExpressServer(); }
    /** The reference of express app. You can control this if you really want. */
    get app() { return this._express; }
    get staticResolver() { return this.configs.get(config_1.STATIC_TYPED_RESOLVER); }
    /**
     * register a controller to application.
     * @param ctrl the constructor of your controller class
     */
    controller(ctrl) {
        if (!ctrl)
            return this;
        this._ctrls.push(ctrl);
        return this;
    }
    injectable(provide, classType, type) {
        if (!provide)
            return this;
        type = type || injectable_1.InjectScope.Singleton;
        this.di.register(provide, classType || provide, type);
        return this;
    }
    scoped(provide, classType) {
        return this.injectable(provide, classType, injectable_1.InjectScope.Scoped);
    }
    singleton(provide, classType) {
        return this.injectable(provide, classType, injectable_1.InjectScope.Singleton);
    }
    useOptions(...args) {
        const [k, v] = args.length <= 1 ? [args.key, args.value] : [...args];
        const isFromClass = type_check_1.TypeCheck.isFromCustomClass(v); // check if the v is the instance of a custom class
        this.configs.set(config_1.createOptions(k, isFromClass ? v : Object.assign(this.configs.get(k) || {}, v || {})));
        return this;
    }
    listen(port) {
        this._listen = port || 3000;
        return this;
    }
    run(work) {
        this.di.complete();
        this._initDefaultMiddlewares();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }
    //#region Private scope
    _initDefaultInjections() {
        this.singleton(config_2.ConfigContainer, this.configs);
    }
    _initDefaultOptions() {
        this.useOptions(config_1.X_POWERED_BY, "Bonbons:1.0.0-beta");
        this.useOptions(config_1.STRING_RESULT_OPTIONS, defaultStringResultOptions());
        this.useOptions(config_1.JSON_RESULT_OPTIONS, defaultJsonResultOptions());
        this.useOptions(config_1.BODY_JSON_PARSER, defaultJsonOptions());
        this.useOptions(config_1.BODY_TEXT_PARSER, defaultTextOptions());
        this.useOptions(config_1.BODY_RAW_PARSER, defaultRawOptions());
        this.useOptions(config_1.BODY_URLENCODED_PARSER, defaultURLEncodedOptions());
        this.useOptions(config_1.STATIC_TYPED_RESOLVER, bonbons_serialize_1.TypedSerializer);
    }
    _initDefaultMiddlewares() {
        this._express.use(middlewares_1.NewXPoweredBy(this.configs.get(config_1.X_POWERED_BY)));
    }
    _registerControllers() {
        this._ctrls.forEach(ctrl => {
            const reflect = reflect_1.Reflection.GetControllerMetadata(ctrl.prototype);
            // console.log(JSON.stringify(reflect, null, "\t"));
            const routes = Object.keys(reflect.router.routes).forEach(key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }
    _createInstance(constor) {
        return new constor(...this.di.resolveDeps(constor));
    }
    _registerRoutes(route, constructor, methodName) {
        route.allowMethods.forEach(m => {
            if (!route.path)
                throw new Error(`invalid REST method path : the path of action '${methodName}' is empty.`);
            const invoke = this._selectFuncMethod(m);
            const middlewares = (route.middleware && route.middleware.list) || [];
            this._selectFormParser(route, middlewares);
            this._decideFinalStep(route, middlewares, constructor, methodName);
            invoke(route.path, ...middlewares);
        });
    }
    _selectFuncMethod(method) {
        let invoke;
        switch (method) {
            case "GET":
            case "POST":
            case "PUT":
            case "DELETE":
            case "PATCH":
            case "OPTIONS":
            case "HEAD":
                invoke = (...args) => this._express[method.toLowerCase()](...args);
                break;
            default: throw new Error(`invalid REST method registeration : the method [${method}] is not allowed.`);
        }
        return invoke;
    }
    _parseFuncParams(constructor, req, rep, route) {
        const context = controller_1.bindContext(this._createInstance(constructor), req, rep);
        const querys = (route.funcParams || []).map(ele => ele.isQuery ? context.context.query(ele.key, ele.type) : context.context.param(ele.key, ele.type));
        if (route.form && route.form.index >= 0) {
            // when use form decorator for params, try to static-typed and inject to function params list.
            const staticType = (route.funcParams || [])[route.form.index];
            querys[route.form.index] = !!(staticType && staticType.type) ? this.staticResolver.FromObject(req.body, staticType.type) : req.body;
        }
        return { context, params: querys };
    }
    _decideFinalStep(route, middlewares, constructor, methodName) {
        middlewares.push((req, rep) => {
            const { context, params } = this._parseFuncParams(constructor, req, rep, route);
            const result = constructor.prototype[methodName].bind(context)(...params);
            if (typeof result === "string") {
                rep.send(result);
            }
            else {
                // rep.send(result && result.toString(this.configs));
                const type = Object.getPrototypeOf(result).constructor;
                if (type === Promise) {
                    result.then(r => rep.send(r.toString(this.configs)));
                }
                else {
                    rep.send(result.toString(this.configs));
                }
            }
        });
    }
    _selectFormParser(route, middlewares) {
        if (route.form && route.form.parser) {
            switch (route.form.parser) {
                case "multiple":
                    middlewares.unshift(core_1.MultiplePartParser().any());
                    break;
                case "json":
                    middlewares.unshift(core_1.JSONParser(this.configs.get(config_1.BODY_JSON_PARSER)));
                    break;
                case "url":
                    middlewares.unshift(core_1.URLEncodedParser(this.configs.get(config_1.BODY_URLENCODED_PARSER)));
                    break;
                case "raw":
                    middlewares.unshift(core_1.RawParser(this.configs.get(config_1.BODY_RAW_PARSER)));
                    break;
                case "text":
                    middlewares.unshift(core_1.TextParser(this.configs.get(config_1.BODY_TEXT_PARSER)));
                    break;
                default: break;
            }
        }
    }
}
exports.ExpressServer = ExpressServer;
function defaultStringResultOptions() {
    return { fromEncoding: "utf8", toEncoding: "utf8" };
}
function defaultJsonResultOptions() {
    return { indentation: true, staticType: false };
}
function defaultURLEncodedOptions() {
    return {
        extended: false,
        inflate: true,
        parameterLimit: 1000,
        type: "application/x-www-form-urlencoded",
        verify: undefined
    };
}
function defaultTextOptions() {
    return {
        defaultCharset: "utf-8",
        inflate: true,
        limit: "10mb",
        type: "text/plain",
        verify: undefined
    };
}
function defaultRawOptions() {
    return {
        inflate: true,
        limit: "10mb",
        type: "application/octet-stream",
        verify: undefined
    };
}
function defaultJsonOptions() {
    return {
        inflate: true,
        limit: "10mb",
        reviver: undefined,
        strict: true,
        type: "application/json",
        verify: undefined
    };
}
//# sourceMappingURL=server.js.map