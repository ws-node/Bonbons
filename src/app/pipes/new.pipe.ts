import { MiddlewarePipe, IContext, HttpRequest, HttpResponse, ControllerContext } from "../../framework";

export class TestPipe extends MiddlewarePipe {

    constructor() { super(); }

    transform(context: ControllerContext): void {
        console.log(context);
    }

}