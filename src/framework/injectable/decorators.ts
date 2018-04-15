import "reflect-metadata";
import { IInjectable } from "../metadata/injectable";
import { PARAMS_META_KEY } from "../metadata/reflect";
import { getDependencies } from "../di/reflect";

/**
 * Define a injectable class for IoC container.
 * You can get the instance by Constructor Injection in constoller or another injectable class instance.
 */
export function Injectabe(config?) {
    return function <T extends { prototype: any }>(target: T) {
        // Do Nothing
        return target;
    };
}