import "reflect-metadata";

import { AllowMethod, IController, IControllerConfig, IMidleware, IControllerMetadata, IRoute } from "../metadata/controller";
import { BaseController } from "./controller";
import { Reflection } from "../di/reflect";
import { PARAMS_META_KEY, BodyParser } from "..";

/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config prefix string
 */
export function Controller(config?: string);
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config an object contains some editable params
 */
export function Controller(config?: IControllerConfig);
export function Controller(config?: string | IControllerConfig) {
    return function <T extends typeof BaseController>(target: T) {
        const prototype = target.prototype;
        const reflect = Reflection.GetControllerMetadata(prototype);
        Reflection.SetControllerMetadata(prototype, registerCompelete(registerPrefix(reflect, config)));
    };
}

/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
export function Method(...allowMethods: AllowMethod[]) {
    return function <T extends BaseController>(target: T, propertyKey: string) {
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { allowMethods }));
    };
}

/**
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @param {string} path
 * @param {string[]} query provide query params names to open static-injection for query params through method
 */
export function Route(path: string, query?: string[]) {
    return function <T extends BaseController>(target: T, propertyKey: string) {
        const querys: any[] = Reflect.getMetadata(PARAMS_META_KEY, target, propertyKey);
        const reflect = Reflection.GetControllerMetadata(target);
        reroute(reflect, propertyKey, { path, funcParams: [] });
        const route = reflect.router.routes[propertyKey];
        const queryList = query || [];
        querys.forEach((q, index) => route.funcParams[index] = { key: <string>(queryList[index] || null), type: q === Object ? null : q });
        Reflection.SetControllerMetadata(target, reflect);
    };
}

/**
 * Define middlewares for controller or a route.
 * @param middlewares middlewares list
 * @param merge merge middlewares list with controller middlewares or not, default is true.
 */
export function Middleware(middlewares: Array<IMidleware>, merge = true) {
    return function <T extends BaseController | (typeof BaseController)>(target: any, propertyKey?: string) {
        const isConstructor = !!(<any>target).prototype;
        const prototype: BaseController = isConstructor ? (<any>target).prototype : <any>target;
        const reflect = Reflection.GetControllerMetadata(prototype);
        if (isConstructor) {
            reflect.middlewares = middlewares;
        } else {
            reroute(reflect, <string>propertyKey, { middleware: { list: middlewares, merge } });
        }
        Reflection.SetControllerMetadata(prototype, reflect);
    };
}

/** Get form message from body when type is [multiple/form-data] */
export function FromForm();
/** Get form message from body when default type is [multiple/form-data] */
export function FromForm(type: string);
export function FromForm(type?: string) {
    return function <T extends BaseController>(target: T, propertyKey: string, index: number) {
        if (index === undefined || index < 0) { return; }
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "mutiple", index } }));
    };
}

/** Get form message from body when type is [application/json] */
export function FromBody();
/** Get form message from body when default type is [application/json] */
export function FromBody(type: string);
/** Get form message from body when default type is [application/json] */
export function FromBody(config: BodyParser.OptionsJson);
export function FromBody(config?: string | BodyParser.OptionsJson) {
    return function <T extends BaseController>(target: T, propertyKey: string, index: number) {
        if (index === undefined || index < 0) { return; }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "json", index } }));
    };
}

/** Get form message from body when type is [application/x-www-form-urlencoded] */
export function FormURL();
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FormURL(type: string);
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FormURL(config: BodyParser.OptionsUrlencoded);
export function FormURL(config?: string | BodyParser.OptionsUrlencoded) {
    return function <T extends BaseController>(target: T, propertyKey: string, index: number) {
        if (index === undefined || index < 0) { return; }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "url", index } }));
    };
}

/** Get form message from body when type is [application/octet-stream] */
export function RawBody();
/** Get form message from body when default type is [application/octet-stream] */
export function RawBody(type: string);
/** Get form message from body when default type is [application/octet-stream] */
export function RawBody(config: BodyParser.Options);
export function RawBody(config?: string | BodyParser.Options) {
    return function <T extends BaseController>(target: T, propertyKey: string, index: number) {
        if (index === undefined || index < 0) { return; }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "raw", index } }));
    };
}

/** Get form message from body when type is [text/plain] */
export function TextBody();
/** Get form message from body when default type is [text/plain] */
export function TextBody(type: string);
/** Get form message from body when default type is [text/plain] */
export function TextBody(config: BodyParser.OptionsText);
export function TextBody(config?: string | BodyParser.OptionsText) {
    return function <T extends BaseController>(target: T, propertyKey: string, index: number) {
        if (index === undefined || index < 0) { return; }
        const type = config && (typeof (config) === "string" ? config : config.type);
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { type, parser: "text", index } }));
    };
}

function initRoutes(reflect: IControllerMetadata, propertyKey: string): IRoute {
    return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = <any>{});
}

function reroute(reflect: IControllerMetadata, propertyKey: string, payload: any) {
    Object.assign(initRoutes(reflect, propertyKey), payload);
    return reflect;
}

/**
 * Check and edit absolute route path, merge middlewares and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(meta: IControllerMetadata) {
    Object.keys(meta.router.routes).map(key => meta.router.routes[key]).forEach(route => {
        if (!(route.path || "").startsWith("/")) {
            route.path = meta.router.prefix + route.path;
        }
        if (route.middleware && route.middleware.merge) {
            route.middleware.list = [...meta.middlewares, ...route.middleware.list];
        }
        if (!route.middleware || !route.middleware.merge) {
            route.middleware = { list: [...meta.middlewares], merge: false };
        }
    });
    return meta;
}

/**
 * Config controller prefix.
 * @param ctrl controller prototype
 * @param prefix
 */
function registerPrefix(meta: IControllerMetadata, config?: string | IControllerConfig) {
    const prefix = typeof config === "string" ? config : config && config.prefix;
    meta.router.prefix = ("/" + (prefix || "") + "/").replace("//", "/");
    return meta;
}