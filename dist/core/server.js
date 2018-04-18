"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const core_1 = require("../metadata/core");
const controller_1 = require("../controller");
const injectable_1 = require("../metadata/injectable");
const reflect_1 = require("../di/reflect");
class ExpressServer {
    constructor() {
        this.container = new di_1.DIContainer();
        this._express = core_1.CreateExpress();
        this._ctrls = [];
        this._metadata = defaultServerMetadata();
    }
    /**
     * Create a new app.
     */
    static Create() { return new ExpressServer(); }
    /** The reference of express app. You can control this if you really want. */
    get app() { return this._express; }
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
        this.container.register(provide, classType || provide, type);
        return this;
    }
    scoped(provide, classType) {
        return this.injectable(provide, classType, injectable_1.InjectScope.Scoped);
    }
    singleton(provide, classType) {
        return this.injectable(provide, classType, injectable_1.InjectScope.Singleton);
    }
    confJSONConvert(option) {
        this._metadata.bodyParseConfig.json = Object.assign(this._metadata.bodyParseConfig.json, option || {});
        return this;
    }
    confRawConvert(option) {
        this._metadata.bodyParseConfig.raw = Object.assign(this._metadata.bodyParseConfig.raw, option || {});
        return this;
    }
    confTextConvert(option) {
        this._metadata.bodyParseConfig.text = Object.assign(this._metadata.bodyParseConfig.text, option || {});
        return this;
    }
    confEncodedConvert(option) {
        this._metadata.bodyParseConfig.urlencoded = Object.assign(this._metadata.bodyParseConfig.urlencoded, option || {});
        return this;
    }
    listen(port) {
        this._listen = port || 3000;
        return this;
    }
    run(work) {
        this.container.complete();
        this._registerControllers();
        this._express.listen(this._listen, work);
    }
    _registerControllers() {
        this._ctrls.forEach(ctrl => {
            const reflect = reflect_1.Reflection.GetControllerMetadata(ctrl.prototype);
            console.log(JSON.stringify(reflect));
            const routes = Object.keys(reflect.router.routes).forEach(key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }
    _createInstance(constor) {
        return new constor(...this.container.resolveDeps(constor));
    }
    _registerRoutes(route, constructor, methodName) {
        route.allowMethods.forEach(method => {
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
            if (!route.path)
                throw new Error(`invalid REST method path : the path of action '${methodName}' is empty.`);
            const middlewares = (route.middleware && route.middleware.list) || [];
            if (route.form && route.form.parser) {
                switch (route.form.parser) {
                    case "mutiple":
                        middlewares.unshift(core_1.MultiplePartParser().any());
                        break;
                    case "json":
                        middlewares.unshift(core_1.JSONParser(this._metadata.bodyParseConfig.json));
                        break;
                    case "url":
                        middlewares.unshift(core_1.URLEncodedParser(this._metadata.bodyParseConfig.urlencoded));
                        break;
                    case "raw":
                        middlewares.unshift(core_1.RawParser(this._metadata.bodyParseConfig.raw));
                        break;
                    case "text":
                        middlewares.unshift(core_1.TextParser(this._metadata.bodyParseConfig.text));
                        break;
                    default: break;
                }
            }
            middlewares.push((req, rep) => {
                const context = controller_1.bindContext(this._createInstance(constructor), req, rep);
                const querys = (route.funcParams || []).map(ele => context.context.query(ele.key, ele.type));
                if (route.form && route.form.index >= 0) {
                    querys[route.form.index] = req.body;
                }
                const result = constructor.prototype[methodName].bind(context)(...querys);
                rep.send(result && result.toString());
            });
            invoke(route.path, ...middlewares);
        });
    }
}
exports.ExpressServer = ExpressServer;
function defaultServerMetadata() {
    return {
        bodyParseConfig: {
            json: defaultJsonOptions(),
            raw: defaultRawOptions(),
            text: defaultTextOptions(),
            urlencoded: defaultURLEncodedOptions()
        }
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