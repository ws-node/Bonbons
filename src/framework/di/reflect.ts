import { PARAMS_META_KEY, CTOR_META_KEY } from "../metadata/reflect";
import { IControllerMetadata } from "../metadata/controller";

export function getDependencies(target): any[] {
    return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}

export class Reflection {

    public static GetInjections(target: any) {
        return getDependencies(target);
    }

    public static GetControllerMetadata(target: any): IControllerMetadata {
        return Reflect.getMetadata(CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, middlewares: [], queryParams: [] };
    }

    public static SetControllerMetadata(target: any, meta: IControllerMetadata) {
        Reflect.defineMetadata(CTOR_META_KEY, meta, target);
    }

}