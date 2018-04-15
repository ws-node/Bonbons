import "reflect-metadata";

import { AllowMethod, IController, IControllerConfig } from "../metadata/controller";
import { BaseController, registerRoute, registerCompelete, registerPrefix } from "./controller";
import { CTOR_METHOD_META_KEY, CTOR_ROUTE_META_KEY } from "../metadata/reflect";

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
        registerPrefix(prototype, typeof config === "string" ? config : config && config.prefix);
        const keys = Reflect.getMetadataKeys(prototype);
        keys.forEach(key => (Reflect.getMetadata(key, prototype) as any[]).forEach(prop => {
            switch (key) {
                case CTOR_METHOD_META_KEY:
                case CTOR_ROUTE_META_KEY:
                    const { propertyKey, ...others } = prop;
                    registerRoute(prototype, propertyKey, others);
                    break;
                default: break;
            }
        }));
        registerCompelete(prototype);
    };
}

/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
export function Method(...allowMethods: AllowMethod[]) {
    return function <T extends BaseController>(target: T, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_METHOD_META_KEY, target) || [];
        values.push({ propertyKey, allowMethods });
        Reflect.defineMetadata(CTOR_METHOD_META_KEY, values, target);
    };
}

/**
 * Define a method path for a route. absolute or relative path is supported..
 * @param {string} path
 */
export function Route(path: string) {
    return function <T extends BaseController>(target: T, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_ROUTE_META_KEY, target) || [];
        values.push({ propertyKey, path });
        Reflect.defineMetadata(CTOR_ROUTE_META_KEY, values, target);
    };
}