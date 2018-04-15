import "reflect-metadata";
/**
 * Define a injectable class for IoC container.
 * You can get the instance by Constructor Injection in constoller or another injectable class instance.
 */
export declare function Injectabe(config?: any): <T extends {
    prototype: any;
}>(target: T) => T;
