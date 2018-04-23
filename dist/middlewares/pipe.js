"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./../controller/context");
const type_check_1 = require("../utils/type-check");
class MiddlewarePipe {
    constructor() {
        this.isError = false;
    }
    throws(error) {
        this.context.errors.add(new Error(error));
    }
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time || 0));
    }
    toMiddleware(configs) {
        const step = (context) => {
            this.context = context;
            return this.transform.bind(this, configs)(context);
        };
        return this.isError ? errorNext(step) : canNext(step);
    }
}
exports.MiddlewarePipe = MiddlewarePipe;
class ErrorMiddlewarePipe extends MiddlewarePipe {
    constructor() {
        super();
        this.isError = true;
    }
}
exports.ErrorMiddlewarePipe = ErrorMiddlewarePipe;
function errorNext(step) {
    return function (error, req, rep, next) { resolvePipeTransform(req, rep, step, next, error); };
}
function canNext(step) {
    return function (req, rep, next) { resolvePipeTransform(req, rep, step, next); };
}
function throwOrNext(context, next) {
    const deepth = context.errors.stack.length;
    if (deepth > 0) {
        next && next(context.errors.stack[deepth - 1]);
    }
    else {
        next && next();
    }
}
function throwAnyway(error, next) {
    next && next(error);
}
function resolvePipeTransform(req, rep, step, next, error) {
    const context = getContext(req, rep, error);
    const result = step(context);
    if (type_check_1.TypeCheck.isFromCustomClass(result || {}, Promise)) {
        result.then(() => throwOrNext(context, next)).catch(err => throwAnyway(err, next));
    }
    else {
        throwOrNext(context, next);
    }
}
function getContext(req, rep, errors) {
    if (!rep.locals) {
        rep.locals = {};
    }
    if (rep.locals.__context) {
        if (!!errors)
            rep.locals.__context.errors.stack.push(errors);
        return rep.locals.__context;
    }
    else {
        return rep.locals.__context = new context_1.ControllerContext(req, rep, errors);
    }
}
//# sourceMappingURL=pipe.js.map