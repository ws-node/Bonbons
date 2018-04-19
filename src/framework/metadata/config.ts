
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
export const JSON_RESULT_OPTIONS = Symbol("__bonbons:json_result_options");