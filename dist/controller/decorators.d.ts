import "reflect-metadata";
import { AllowMethod, IControllerConfig } from "../metadata/controller";
import { BaseController } from "./controller";
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config prefix string
 */
export declare function Controller(config?: string): any;
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config an object contains some editable params
 */
export declare function Controller(config?: IControllerConfig): any;
/**
 * Define a route method for the controller. default allowed method is 'GET'.
 * @param {string[]} allowMethods
 */
export declare function Method(...allowMethods: AllowMethod[]): <T extends BaseController>(target: T, propertyKey: string) => void;
/**
 * Define a method path for a route. absolute or relative path is supported..
 * @param {string} path
 */
export declare function Route(path: string): <T extends BaseController>(target: T, propertyKey: string) => void;
