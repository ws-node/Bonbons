"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function NewXPoweredBy(value) {
    return function (req, rep, next) {
        rep.setHeader("x-powered-by", value);
        next();
    };
}
exports.NewXPoweredBy = NewXPoweredBy;
//# sourceMappingURL=index.js.map