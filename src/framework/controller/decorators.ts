import "reflect-metadata";

import { AllowMethod, IController } from "../metadata/controller";
import { BaseController, registerRoute } from "./controller";
import { CTOR_METHOD_META_KEY, CTOR_ROUTE_META_KEY } from "../metadata/reflect";

export interface Type<T> {
    new(...args: any[]): T;
}

export function Controller(config?) {
    return function <T extends typeof BaseController>(target: any) {
        const prototype: BaseController = (<T>target).prototype;
        const keys = Reflect.getMetadataKeys(prototype);
        keys.forEach(key => (Reflect.getMetadata(key, prototype) as any[]).forEach(prop => {
            switch (key) {
                case CTOR_METHOD_META_KEY:
                case CTOR_ROUTE_META_KEY:
                    const { propertyKey, ...others } = prop;
                    registerRoute(prototype, propertyKey, others);
                    break;
            }
        }));
    };
}

export function Method(...allowMethods: AllowMethod[]) {
    return function <T extends typeof BaseController>(target: BaseController, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_METHOD_META_KEY, target) || [];
        values.push({ propertyKey, allowMethods });
        Reflect.defineMetadata(CTOR_METHOD_META_KEY, values, target);
    };
}

export function Route(path: string) {
    return function <T extends typeof BaseController>(target: BaseController, propertyKey: string) {
        const values = Reflect.getMetadata(CTOR_ROUTE_META_KEY, target) || [];
        values.push({ propertyKey, path });
        Reflect.defineMetadata(CTOR_ROUTE_META_KEY, values, target);
    };
}