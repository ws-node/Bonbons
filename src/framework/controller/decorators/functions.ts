import { BaseController } from "../controller";
import { IMidleware, AllowMethod } from "../../metadata/controller";
import { Reflection } from "../../di/reflect";
import { reroute } from "./base";
import { PARAMS_META_KEY } from "../../metadata/reflect";

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
        let pcount = 0;
        path.replace(/:([^\/]+)(\/|$)/g, (match, $1) => {
            const type = querys[pcount];
            route.funcParams.push({
                key: $1,
                type: type === Object ? null : type,
                isQuery: false
            });
            pcount += 1;
            return path;
        });
        const queryList = query || [];
        querys.slice(pcount).forEach((q, index) => route.funcParams.push({
            key: <string>(queryList[index] || null),
            type: q === Object ? null : q,
            isQuery: true
        }));
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