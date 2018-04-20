
export type ConfigKey = symbol | string;

export interface IConfigContainer {
    set<K extends ConfigKey, V>(options: IOptions<K, V>): void;
    get(key: ConfigKey): any;
}

export interface IOptions<K extends ConfigKey, V extends any> {
    key: K;
    value: V;
}

export function createOptions<K extends ConfigKey, V extends any>(key: K, value: V): IOptions<K, V> {
    return ({ key, value });
}

export const BODY_PARSE_METADATA = Symbol("__bonbons:body_parser_metadata");
export const BODY_JSON_PARSE = Symbol("__bonbons:body_json_parse");
export const BODY_RAW_PARSE = Symbol("__bonbons:body_raw_parse");
export const BODY_TEXT_PARSE = Symbol("__bonbons:body_text_parse");
export const BODY_URLENCODED_PARSE = Symbol("__bonbons:body_urlencoded_parse");

export const JSON_RESULT_OPTIONS = Symbol("__bonbons:json_result_options");