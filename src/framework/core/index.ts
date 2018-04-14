import { BaseController, bindContext } from "./../controller";
import { CreateExpress, Express } from "../metadata/core";
import { InjectScope } from "../metadata/injectable";
import { DIContainer } from "../di";

export class ExpressServer {

    private container = new DIContainer();

    private _express = CreateExpress();
    public get app(): Express { return this._express; }

    private _listen: number;
    private _ctrls: any[] = [];

    public controller<T>(ctrl: T) {
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

    public listen(port: number) {
        this._listen = port || 3000;
        return this;
    }

    public run(work: () => void) {
        this.container.complete();
        this._ctrls.forEach(ctrl => {
            const result = new (<any>ctrl)(...this.container.resolveDeps(ctrl));
            result.routes.forEach(
                route => route.allowMethods.forEach(
                    method => this._express[method.toLowerCase()](route.path, (req, rep) => {
                        const instance = new (<any>ctrl)(...this.container.resolveDeps(ctrl));
                        result[route.methodName].bind(bindContext(instance, req, rep))();
                    })));
        });
        this._express.listen(this._listen, work);
    }

}

// tslint:disable-next-line:variable-name
export const Server = new ExpressServer();
