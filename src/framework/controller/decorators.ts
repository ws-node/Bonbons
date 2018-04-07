import { AllowMethod, IController } from "../metadata/controller";
import { BaseController } from "./controller";

import "reflect-metadata";

export const CTOR_METHOD_METAKEY = Symbol("__ctor_method_meta");
export const CTOR_ROUTE_METAKEY = Symbol("__ctor_route_meta");

export interface Type<T> {
    new(...args: any[]): T;
}

export function Controller(config?) {
    return function <T extends typeof BaseController>(target: any) {
        const prototype: BaseController = (<T>target).prototype;
        const keys = Reflect.getMetadataKeys(prototype);
        keys.forEach(key => (Reflect.getMetadata(key, prototype) as any[]).forEach(prop => {
            switch (key) {
                case CTOR_METHOD_METAKEY:
                case CTOR_ROUTE_METAKEY:
                    const { propertyKey, ...others } = prop;
                    prototype.registerRoute(propertyKey, others);
                    break;
            }
        }));
    };
}

export function Method(...allowMethods: AllowMethod[]) {
    return function <T extends typeof BaseController>(target: BaseController, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_METHOD_METAKEY, target) || [];
        values.push({ propertyKey, allowMethods });
        Reflect.defineMetadata(CTOR_METHOD_METAKEY, values, target);
    };
}

export function Route(path: string) {
    return function <T extends typeof BaseController>(target: BaseController, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_ROUTE_METAKEY, target) || [];
        values.push({ propertyKey, path });
        Reflect.defineMetadata(CTOR_ROUTE_METAKEY, values, target);
    };
}