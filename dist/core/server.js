"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const core_1 = require("../metadata/core");
const controller_1 = require("../controller");
const injectable_1 = require("../metadata/injectable");
const reflect_1 = require("../di/reflect");
const config_1 = require("../config");
const config_2 = require("../metadata/config");
const bonbons_serialize_1 = require("../utils/bonbons-serialize");
class ExpressServer {
    constructor() {
        this.di = new di_1.DIContainer();
        this.configs = new config_1.ConfigContainer();
        this._express = core_1.CreateExpress();
        this._ctrls = [];
        this.initDefaultOptions();
    }
    /**
     * Create a new app.
     */
    static Create() { return new ExpressServer(); }
    /** The reference of express app. You can control this if you really want. */
    get app() { return this._express; }
    /** the metadata for body-parser when nesessary. */
    get parseMeta() {
        return this.configs.get(config_2.BODY_PARSE_METADATA);
    }
    set parseMeta(value) {
        this.configs.set(config_2.createOptions(config_2.BODY_PARSE_METADATA, value));
    }
    /**
     * register a controller to application.
     * @param ctrl
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
    confJSONConvert(option) {
        this.parseMeta.json = Object.assign(this.parseMeta.json, option || {});
        return this;
    }
    confRawConvert(option) {
        this.parseMeta.raw = Object.assign(this.parseMeta.raw, option || {});
        return this;
    }
    confTextConvert(option) {
        this.parseMeta.text = Object.assign(this.parseMeta.text, option || {});
        return this;
    }
    useOptions(...args) {
        const [k, v] = args.length <= 1 ? [args.key, args.value] : [...args];
        const oldValue = this.configs.get(k) || {};
        this.configs.set(config_2.createOptions(k, Object.assign(oldValue, v || {})));
        return this;
    }
    confEncodedConvert(option) {
        this.parseMeta.urlencoded = Object.assign(this.parseMeta.urlencoded, option || {});
        return this;
    }
    listen(port) {
        this._listen = port || 3000;
        return this;
    }
    run(work) {
        this.di.complete();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }
    initDefaultOptions() {
        this.parseMeta = defaultServerMetadata();
        this.useOptions(config_2.JSON_RESULT_OPTIONS, { indentation: true });
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
            const staticType = (route.funcParams || [])[route.form.index];
            querys[route.form.index] = !!(staticType && staticType.type) ? bonbons_serialize_1.Deserialize(req.body, staticType.type) : req.body;
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
                rep.send(result && result.toString(this.configs));
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
                    middlewares.unshift(core_1.JSONParser(this.parseMeta.json));
                    break;
                case "url":
                    middlewares.unshift(core_1.URLEncodedParser(this.parseMeta.urlencoded));
                    break;
                case "raw":
                    middlewares.unshift(core_1.RawParser(this.parseMeta.raw));
                    break;
                case "text":
                    middlewares.unshift(core_1.TextParser(this.parseMeta.text));
                    break;
                default: break;
            }
        }
    }
}
exports.ExpressServer = ExpressServer;
function defaultServerMetadata() {
    return {
        json: defaultJsonOptions(),
        raw: defaultRawOptions(),
        text: defaultTextOptions(),
        urlencoded: defaultURLEncodedOptions()
    };
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