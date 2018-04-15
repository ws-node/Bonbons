"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../controller");
const core_1 = require("../metadata/core");
const injectable_1 = require("../metadata/injectable");
const di_1 = require("../di");
const reflect_1 = require("../di/reflect");
class ExpressServer {
    constructor() {
        this.container = new di_1.DIContainer();
        this._express = core_1.CreateExpress();
        this._ctrls = [];
    }
    static Create() { return new ExpressServer(); }
    get app() { return this._express; }
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
            const routes = Object.keys(reflect.router.routes).forEach(key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }
    _createInstance(constor) {
        return new constor(...this.container.resolveDeps(constor));
    }
    _registerRoutes(route, constructor, methodName) {
        const reflect = reflect_1.Reflection.GetControllerMetadata(constructor.prototype);
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
            middlewares.push((req, rep) => {
                const context = controller_1.bindContext(this._createInstance(constructor), req, rep);
                const querys = (reflect.router.routes[methodName].queryParams || []).map(ele => context.context.query(ele.key, ele.type));
                const result = constructor.prototype[methodName].bind(context)(...querys);
                rep.send(result && result.toString());
            });
            invoke(route.path, ...middlewares);
        });
    }
}
exports.Server = ExpressServer;
//# sourceMappingURL=index.js.map