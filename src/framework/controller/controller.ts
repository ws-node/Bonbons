import { IController } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";

export abstract class BaseController implements IController {

    protected _routes: Array<IRoute>;
    public get routes() { return this._routes || (this._routes = []); }

    constructor() { }

    registerRoute(methodName: string, config: any) {
        const route = this.routes.find(i => i.methodName === methodName);
        if (!route) {
            this.routes.push(Object.assign({ methodName }, config));
        } else {
            Object.assign(route, config);
        }
    }

}
