import { IStaticTypedResolver } from "./static";
import { BodyParser } from "./core";
import { JsonResultOptions } from "./controller";

export interface IConfigContainer {
    set<K extends ConfigKey<any>, V>(options: IOptions<V>): void;
    get<T>(key: ConfigKey<T>): T;
}

export interface IOptions<V> {
    key: ConfigKey<any>;
    value: V;
}

export function createOptions<T>(key: ConfigKey<any>, value: T): IOptions<T> {
    return ({ key, value });
}

export interface ConfigKey<T> {
    key: symbol;
}

export function createConfigKey<T>(key: string) { return { key: Symbol("__bonbons:" + key) } as ConfigKey<T>; }

export const BODY_JSON_PARSER = createConfigKey<BodyParser.OptionsJson>("body_json_parse");
export const BODY_RAW_PARSER = createConfigKey<BodyParser.Options>("body_raw_parse");
export const BODY_TEXT_PARSER = createConfigKey<BodyParser.OptionsText>("body_text_parse");
export const BODY_URLENCODED_PARSER = createConfigKey<BodyParser.OptionsUrlencoded>("body_urlencoded_parse");

export const STATIC_TYPED_RESOLVER = createConfigKey<IStaticTypedResolver>("static_typed_resolver");

export const JSON_RESULT_OPTIONS = createConfigKey<JsonResultOptions>("json_result_options");