import "reflect-metadata";
import { IInjectable } from "../metadata/injectable";
import { PARAMS_META_KEY } from "../metadata/reflect";
import { getDependencies } from "../di/reflect";

export function Injectabe(config?) {
    return function <T extends { prototype: any }>(target: T) {
        const prototype: IInjectable = <any>target.prototype;
        const deps = getDependencies(target);
    };
}