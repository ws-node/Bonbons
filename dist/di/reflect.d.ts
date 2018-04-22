import { IControllerMetadata } from "../metadata/controller";
export declare function getDependencies(target: any): any[];
export declare class ReflectionConstructor {
    GetInjections(target: any): any[];
    GetControllerMetadata(target: any): IControllerMetadata;
    SetControllerMetadata(target: any, meta: IControllerMetadata): void;
}
export declare const Reflection: ReflectionConstructor;
