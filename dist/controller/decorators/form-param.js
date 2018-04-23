"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../../di/reflect");
const base_1 = require("./base");
const controller_1 = require("../../metadata/controller");
function FormData(type) { return formDecoratorFactory(type, controller_1.FormDcsType.MultipleFormData, null); }
exports.FormData = FormData;
function FromBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), controller_1.FormDcsType.ApplicationJson, config);
}
exports.FromBody = FromBody;
function FromForm(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), controller_1.FormDcsType.UrlEncoded, config);
}
exports.FromForm = FromForm;
function RawBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), controller_1.FormDcsType.Raw, config);
}
exports.RawBody = RawBody;
function TextBody(config) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), controller_1.FormDcsType.TextPlain, config);
}
exports.TextBody = TextBody;
function formDecoratorFactory(type, parser, configs) {
    return function (target, propertyKey, index_descriptor) {
        const isParam = typeof index_descriptor === "number" && index_descriptor >= 0;
        const reflect = reflect_1.Reflection.GetControllerMetadata(target);
        if (isParam) {
            reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { form: { type, parser, configs, index: index_descriptor } }));
        }
        else {
            reflect_1.Reflection.SetControllerMetadata(target, base_1.reroute(reflect, propertyKey, { form: { type, parser, configs } }));
        }
    };
}
//# sourceMappingURL=form-param.js.map