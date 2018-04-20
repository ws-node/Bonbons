import { Reflection } from "../../di/reflect";
import { BodyParser } from "../../metadata/core";
import { BaseController } from "../controller";
import { reroute } from "./base";

/** Get form message from body when type is [multiple/form-data] */
export function FormData();
/** Get form message from body when default type is [multiple/form-data] */
export function FormData(type: string);
export function FormData(type?: string) { return formDecoratorFactory(type, "multiple"); }

/** Get form message from body when type is [application/json] */
export function FromBody();
/** Get form message from body when default type is [application/json] */
export function FromBody(type: string);
/** Get form message from body when default type is [application/json] */
export function FromBody(config: BodyParser.OptionsJson);
export function FromBody(config?: string | BodyParser.OptionsJson) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "json");
}

/** Get form message from body when type is [application/x-www-form-urlencoded] */
export function FromForm();
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FromForm(type: string);
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FromForm(config: BodyParser.OptionsUrlencoded);
export function FromForm(config?: string | BodyParser.OptionsUrlencoded) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "url");
}

/** Get form message from body when type is [application/octet-stream] */
export function RawBody();
/** Get form message from body when default type is [application/octet-stream] */
export function RawBody(type: string);
/** Get form message from body when default type is [application/octet-stream] */
export function RawBody(config: BodyParser.Options);
export function RawBody(config?: string | BodyParser.Options) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "raw");
}

/** Get form message from body when type is [text/plain] */
export function TextBody();
/** Get form message from body when default type is [text/plain] */
export function TextBody(type: string);
/** Get form message from body when default type is [text/plain] */
export function TextBody(config: BodyParser.OptionsText);
export function TextBody(config?: string | BodyParser.OptionsText) {
    return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), "text");
}

function formDecoratorFactory(type: any, parser: string) {
    return function <T extends BaseController>(target: T, propertyKey: string, index_descriptor: number | TypedPropertyDescriptor<T>) {
        // if (index === undefined || index < 0) { return; }
        const isParam = typeof index_descriptor === "number" && index_descriptor >= 0;
        const reflect = Reflection.GetControllerMetadata(target);
        if (isParam) {
            Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser, index: <number>index_descriptor } }));
        } else {
            Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser } }));
        }
    };
}
