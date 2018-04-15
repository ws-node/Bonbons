import { BaseController } from "./../controller";
import { Express } from "../metadata/core";
import { InjectScope } from "../metadata/injectable";
declare class ExpressServer {
    static Create(): ExpressServer;
    private container;
    private _express;
    readonly app: Express;
    private _listen;
    private _ctrls;
    controller<T extends typeof BaseController>(ctrl: any): this;
    injectable(provide?: any, type?: InjectScope): ExpressServer;
    injectable(provide?: any, classType?: any, type?: InjectScope): ExpressServer;
    scoped(provide?: any): ExpressServer;
    scoped(provide?: any, classType?: any): ExpressServer;
    singleton(provide?: any): ExpressServer;
    singleton(provide?: any, classType?: any): ExpressServer;
    listen(port: number): this;
    run(work: () => void): void;
    private _registerControllers();
    private _createInstance<T>(constor);
    private _registerRoutes(route, constructor);
}
export { ExpressServer as Server };
