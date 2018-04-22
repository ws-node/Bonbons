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
export function createOptions<V>(key: ConfigKey<V>, value: V): IOptions<V> {
    return ({ key, value });
}

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
export function createConfigKey<T>(key: string) { return { key: Symbol("__bonbons:" + key) } as ConfigKey<T>; }

export const BODY_JSON_PARSER = createConfigKey<BodyParser.OptionsJson>("body_json_parse");
export const BODY_RAW_PARSER = createConfigKey<BodyParser.Options>("body_raw_parse");
export const BODY_TEXT_PARSER = createConfigKey<BodyParser.OptionsText>("body_text_parse");
export const BODY_URLENCODED_PARSER = createConfigKey<BodyParser.OptionsUrlencoded>("body_urlencoded_parse");
export const STATIC_TYPED_RESOLVER = createConfigKey<IStaticTypedResolver>("static_typed_resolver");
export const JSON_RESULT_OPTIONS = createConfigKey<JsonResultOptions>("json_result_options");
export const STRING_RESULT_OPTIONS = createConfigKey<StringResultOptions>("string_result_options");