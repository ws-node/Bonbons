import { BaseController, bindContext } from "./../controller";
import { CreateExpress, Express, Response } from "../metadata/core";
import { InjectScope } from "../metadata/injectable";
import { DIContainer } from "../di";
import { IRoute, IMethodResult } from "../metadata/controller";

class ExpressServer {

    public static Create() { return new ExpressServer(); }

    private container = new DIContainer();

    private _express = CreateExpress();
    public get app(): Express { return this._express; }

    private _listen: number;
    private _ctrls: (typeof BaseController)[] = [];

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
        this._ctrls.forEach(ctrl => ctrl.prototype.routes.forEach(route => this._registerRoutes(route, ctrl)));
    }

    private _createInstance<T extends typeof BaseController>(constor: T): T {
        return new (<any>constor)(...this.container.resolveDeps(constor));
    }

    private _registerRoutes(route: IRoute, constructor: any) {
        route.allowMethods.forEach(
            method => {
                let invoke: (path, fn) => void;
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
                if (!route.path) throw new Error(`invalid REST method path : the path of action '${route.methodName}' is empty.`);
                console.log(route.path);
                invoke(route.path, (req, rep: Response) => {
                    const result: IMethodResult | string = constructor.prototype[route.methodName].bind(bindContext(this._createInstance(constructor), req, rep))();
                    rep.send(result && result.toString());
                });
            });
    }

}

export { ExpressServer as Server };

