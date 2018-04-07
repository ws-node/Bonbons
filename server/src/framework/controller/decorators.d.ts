import { AllowMethod } from "../metadata/controller";
import { BaseController } from "./controller";
import "reflect-metadata";
export declare const CTOR_METHOD_METAKEY: unique symbol;
export declare const CTOR_ROUTE_METAKEY: unique symbol;
export interface Type<T> {
    new (...args: any[]): T;
}
export declare function Controller(config?: any): <T extends typeof BaseController>(target: any) => void;
export declare function Method(...allowMethods: AllowMethod[]): <T extends typeof BaseController>(target: BaseController, propertyKey: string) => void;
export declare function Route(path: string): <T extends typeof BaseController>(target: BaseController, propertyKey: string) => void;
