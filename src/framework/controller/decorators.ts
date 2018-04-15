import "reflect-metadata";

import { AllowMethod, IController, IControllerConfig, IMidleware, IControllerMetadata, IRoute } from "../metadata/controller";
import { BaseController } from "./controller";
import { Reflection } from "../di/reflect";

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
 * Define a method path for a route. absolute or relative path is supported..
 * @param {string} path
 */
export function Route(path: string) {
    return function <T extends BaseController>(target: T, propertyKey: string) {
        const reflect = Reflection.GetControllerMetadata(target);
        Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { path }));
    };
}

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