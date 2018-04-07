import { IController } from "../metadata/controller";
import { IRoute } from "./../metadata/controller";
export declare abstract class BaseController implements IController {
    protected _routes: Array<IRoute>;
    readonly routes: IRoute[];
    constructor();
    registerRoute(methodName: string, config: any): void;
}
