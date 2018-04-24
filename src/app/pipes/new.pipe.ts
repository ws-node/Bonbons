import { MiddlewarePipe, IContext, HttpRequest, HttpResponse, ControllerContext, IConfigContainer } from "../../framework";

export class RandomBreak extends MiddlewarePipe {

    constructor() { super(); }

    async process(): Promise<void> {
        this.context.locals.set("woshinidie", 1024);
        await this.sleep(100);
        const k = parseInt((Math.random() * 100).toString(), 10) % 2 === 1;
        console.log(k);
        if (k) {
            this.throws("哈哈哈哈哈哈哈哈，崩溃了吧");
        }
    }

}