"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../../di/reflect");
const base_1 = require("./base");
function FormData(type) { return formDecoratorFactory(type, "multiple"); }
exports.FormData = FormData;
function FromBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "json");
}
exports.FromBody = FromBody;
function FromForm(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "url");
}
exports.FromForm = FromForm;
function RawBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "raw");
}
exports.RawBody = RawBody;
function TextBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "text");
}
exports.TextBody = TextBody;
function formDecoratorFactory(type, parser) {
    return function (target, propertyKey, index) {
        if (index === undefined || index < 0) {
            return;
        }
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { form: { type, parser, index } }));
    };
}
//# sourceMappingURL=form-param.js.map