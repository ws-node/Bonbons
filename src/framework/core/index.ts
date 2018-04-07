import { BaseController } from "./../controller";
import { CreateExpress, Express } from "../metadata/core";

export class ExpressServer {

    private _express = CreateExpress();
    public get app(): Express { return this._express; }

    private _listen: number;

    public controller(ctrl: typeof BaseController) {
        const result = new (<any>ctrl)();
        result.routes.forEach(
            route => route.allowMethods.forEach(
                method => this._express[method.toLowerCase()](route.path, (...args: any[]) => result[route.methodName](...args))));
        return this;
    }

    public listen(port: number) {
        this._listen = port || 3000;
        return this;
    }

    public run(work: () => void) {
        this._express.listen(this._listen, work);
    }

}

// tslint:disable-next-line:variable-name
export const Server = new ExpressServer();
