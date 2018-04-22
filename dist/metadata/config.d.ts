/// <reference types="body-parser" />
import { IStaticTypedResolver } from "./static";
import { BodyParser } from "./core";
import { JsonResultOptions, StringResultOptions } from "./controller";
/** configuration container interface */
export interface IConfigContainer {
    set<K extends ConfigKey<V>, V>(options: IOptions<V>): void;
    get<T>(key: ConfigKey<T>): T;
}
/** configuration container options */
export interface IOptions<V> {
    key: ConfigKey<V>;
    value: V;
}
/** Create a configuration container options */
export declare function createOptions<V>(key: ConfigKey<V>, value: V): IOptions<V>;
/**
 * The unique key for registering in the configuration container
 */
export interface ConfigKey<T> {
    key: symbol;
}
/**
 * Create a unique key for registering in the configuration container
 * @param key value
 */
export declare function createConfigKey<T>(key: string): ConfigKey<T>;
export declare const BODY_JSON_PARSER: ConfigKey<BodyParser.OptionsJson>;
export declare const BODY_RAW_PARSER: ConfigKey<BodyParser.Options>;
export declare const BODY_TEXT_PARSER: ConfigKey<BodyParser.OptionsText>;
export declare const BODY_URLENCODED_PARSER: ConfigKey<BodyParser.OptionsUrlencoded>;
export declare const STATIC_TYPED_RESOLVER: ConfigKey<IStaticTypedResolver>;
export declare const JSON_RESULT_OPTIONS: ConfigKey<JsonResultOptions>;
export declare const STRING_RESULT_OPTIONS: ConfigKey<StringResultOptions>;
export declare const X_POWERED_BY: ConfigKey<string>;
