import { PARAMS_META_KEY, CTOR_META_KEY } from "../metadata/reflect";
import { IControllerMetadata } from "../metadata/controller";

export function getDependencies(target): any[] {
    return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}

export class ReflectionConstructor {

    public GetInjections(target: any) {
        return getDependencies(target);
    }

    public GetControllerMetadata(target: any): IControllerMetadata {
        return Reflect.getMetadata(CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, middlewares: [] };
    }

    public SetControllerMetadata(target: any, meta: IControllerMetadata) {
        Reflect.defineMetadata(CTOR_META_KEY, meta, target);
    }

}

export const Reflection = new ReflectionConstructor();
