import { BaseController, bindContext } from "./../controller";
import { CreateExpress, Express, Response } from "../metadata/core";
import { InjectScope } from "../metadata/injectable";
import { DIContainer } from "../di";
import { IRoute, IMethodResult } from "../metadata/controller";
import { Reflection } from "../di/reflect";

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
        this._ctrls.forEach(ctrl => {
            const reflect = Reflection.GetControllerMetadata(ctrl.prototype);
            const routes = Object.keys(reflect.router.routes).forEach(
                key => this._registerRoutes(reflect.router.routes[key], ctrl, key));
        });
    }

    private _createInstance<T extends typeof BaseController>(constor: T): BaseController {
        return new (<any>constor)(...this.container.resolveDeps(constor));
    }

    private _registerRoutes<T extends typeof BaseController>(route: IRoute, constructor: T, methodName: string) {
        const reflect = Reflection.GetControllerMetadata(constructor.prototype);
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
                middlewares.push((req, rep: Response) => {
                    const context = bindContext(this._createInstance(constructor), req, rep);
                    const querys = (reflect.router.routes[methodName].queryParams || []).map(ele => context.context.query(ele.key, ele.type));
                    const result: IMethodResult | string = constructor.prototype[methodName].bind(context)(...querys);
                    rep.send(result && result.toString());
                });
                invoke(route.path, ...middlewares);
            });
    }

}

export { ExpressServer as Server };

