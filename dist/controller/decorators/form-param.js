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
    return function (target, propertyKey, index_descriptor) {
        const isParam = typeof index_descriptor === "number" && index_descriptor >= 0;
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        if (isParam) {
            reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { form: { type, parser, index: index_descriptor } }));
        }
        else {
            reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { form: { type, parser } }));
        }
    };
}
//# sourceMappingURL=form-param.js.map