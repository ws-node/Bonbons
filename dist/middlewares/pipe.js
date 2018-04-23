"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./../controller/context");
class MiddlewarePipe {
    constructor() {
        this.canNext = true;
        this.hasError = false;
    }
    toMiddleware() {
        const step = this.transform.bind(this);
        return this.hasError && this.canNext ? errorNext(step) :
            this.hasError && !this.canNext ? errorStop(step) :
                this.canNext ? canNext(step) :
                    shouldStop(step);
    }
}
exports.MiddlewarePipe = MiddlewarePipe;
class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor() {
        super();
        this.hasError = false;
    }
}
exports.ErrorMiddlewarePipe = ErrorMiddlewarePipe;
function createInstance(constor, depts) {
    return new constor(...(depts || []));
}
function errorNext(step) {
    return (error, req, rep, next) => {
        step(getContext(req, rep));
        next();
    };
}
function errorStop(step) {
    return (error, req, rep) => {
        step(getContext(req, rep));
    };
}
function canNext(step) {
    return (req, rep, next) => {
        step(getContext(req, rep));
        next();
    };
}
function shouldStop(step) {
    return (req, rep) => {
        step(getContext(req, rep));
    };
}
function getContext(req, rep) {
    if (!rep.locals) {
        rep.locals = {};
    }
    if (rep.locals.__context) {
        return rep.locals.__context;
    }
    else {
        return rep.locals.__context = new context_1.ControllerContext(req, rep);
    }
}
//# sourceMappingURL=pipe.js.map