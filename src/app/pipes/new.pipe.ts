import { MiddlewarePipe, IContext, HttpRequest, HttpResponse, ControllerContext, IConfigContainer, createPipeBundle, IPipeFactory } from "../../framework";

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

export class TokenCheck extends MiddlewarePipe {

    constructor(private token: string) { super(); }

    process(): void | Promise<void> {
        const tk: string = this.context.request.headers.get("jwt-token");
        if (!tk || tk !== (this.token || "default_token")) {
            // this.throws("401 unauthorize");
            this.redirect(301, "/api/error401");
        }
    }

}

export const Authorize: IPipeFactory = createPipeBundle(TokenCheck);