import "reflect-metadata";

import { IControllerMetadata, IRoute } from "../../metadata/controller";

export function initRoutes(reflect: IControllerMetadata, propertyKey: string): IRoute {
    return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = <any>{});
}

export function reroute(reflect: IControllerMetadata, propertyKey: string, payload: any) {
    Object.assign(initRoutes(reflect, propertyKey), payload);
    return reflect;
}