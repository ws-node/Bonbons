"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./../controller");
const core_1 = require("../metadata/core");
const injectable_1 = require("../metadata/injectable");
const di_1 = require("../di");
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
        this._ctrls.forEach(ctrl => ctrl.prototype.routes.forEach(route => this._registerRoutes(route, ctrl)));
    }
    _createInstance(constor) {
        return new constor(...this.container.resolveDeps(constor));
    }
    _registerRoutes(route, constructor) {
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
                throw new Error(`invalid REST method path : the path of action '${route.methodName}' is empty.`);
            console.log(route.path);
            invoke(route.path, (req, rep) => {
                const result = constructor.prototype[route.methodName].bind(controller_1.bindContext(this._createInstance(constructor), req, rep))();
                rep.send(result && result.toString());
            });
        });
    }
}
exports.Server = ExpressServer;
//# sourceMappingURL=index.js.map