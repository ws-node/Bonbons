import { IControllerMetadata } from "../metadata/controller";
export declare function getDependencies(target: any): any[];
export declare class Reflection {
    static GetInjections(target: any): any[];
    static GetControllerMetadata(target: any): IControllerMetadata;
    static SetControllerMetadata(target: any, meta: IControllerMetadata): void;
}
