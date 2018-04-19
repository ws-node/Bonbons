import { IControllerConfig, IControllerMetadata } from "../../metadata/controller";
import { BaseController } from "../controller";
import { Reflection } from "../../di/reflect";

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