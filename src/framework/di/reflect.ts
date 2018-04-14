import { PARAMS_META_KEY } from "../metadata/reflect";

export function getDependencies(target): any[] {
    return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}