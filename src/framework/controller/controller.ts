import { IController, IContext } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";
import { Request, Response } from "../metadata";

export abstract class BaseController implements IController {

    protected _routes: Array<IRoute>;
    public get routes() { return this._routes || (this._routes = []); }

    protected _context: IContext;
    public get context(): IContext { return this._context; }

    public get request(): Request { return this.context.request; }
    public get response(): Response { return this.context.response; }

    constructor() { }

}

export function registerRoute(ctrl: any, methodName: string, config: any) {
    const route = ctrl.routes.find(i => i.methodName === methodName);
    if (!route) {
        ctrl.routes.push(Object.assign({ methodName }, config));
    } else {
        Object.assign(route, config);
    }
}

export function bindContext(ctrl, request, response) {
    ctrl._context = { request, response };
    return ctrl;
}
