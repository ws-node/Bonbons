import { BaseController } from "./../controller";
import { Express } from "../metadata/core";
export declare class ExpressServer {
    private _express;
    readonly app: Express;
    private _listen;
    controller(ctrl: typeof BaseController): this;
    listen(port: number): this;
    run(work: () => void): void;
}
export declare const Server: ExpressServer;
