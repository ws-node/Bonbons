import { HttpRequest, HttpResponse, IControllerContext, ControllerContext } from "./../controller/context";
import { IMiddlewarePipe, IMiddleware } from "../metadata/controller";

export abstract class MiddlewarePipe implements IMiddlewarePipe<ControllerContext> {

    protected canNext = true;
    protected hasError = false;

    constructor() { }

    abstract transform(context: ControllerContext): void;

    toMiddleware(): IMiddleware {
        const step = this.transform.bind(this);
        return this.hasError && this.canNext ? errorNext(step) :
            this.hasError && !this.canNext ? errorStop(step) :
                this.canNext ? canNext(step) :
                    shouldStop(step);
    }

}

export abstract class ErrorMiddlewarePipe extends MiddlewarePipe {

    constructor() {
        super();
        this.hasError = false;
    }

    abstract transform(context: IControllerContext): void;

}

function createInstance<T extends { new(...args): T }>(constor: any, depts: any[]): T {
    return new (<any>constor)(...(depts || []));
}

function errorNext(step: (context: IControllerContext) => void) {
    return (error, req, rep, next) => {
        step(getContext(req, rep));
        next();
    };
}

function errorStop(step: (context: IControllerContext) => void) {
    return (error, req, rep) => {
        step(getContext(req, rep));
    };
}

function canNext(step: (context: IControllerContext) => void) {
    return (req, rep, next) => {
        step(getContext(req, rep));
        next();
    };
}

function shouldStop(step: (context: IControllerContext) => void) {
    return (req, rep) => {
        step(getContext(req, rep));
    };
}

function getContext(req: any, rep: any) {
    if (!rep.locals) { rep.locals = {}; }
    if (rep.locals.__context) {
        return rep.locals.__context;
    } else {
        return rep.locals.__context = new ControllerContext(req, rep);
    }
}