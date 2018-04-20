export declare type ConfigKey = symbol | string;
export interface IConfigContainer {
    set<K extends ConfigKey, V>(options: IOptions<K, V>): void;
    get(key: ConfigKey): any;
}
export interface IOptions<K extends ConfigKey, V extends any> {
    key: K;
    value: V;
}
export declare function createOptions<K extends ConfigKey, V extends any>(key: K, value: V): IOptions<K, V>;
export declare const BODY_JSON_PARSE: unique symbol;
export declare const BODY_RAW_PARSE: unique symbol;
export declare const BODY_TEXT_PARSE: unique symbol;
export declare const BODY_URLENCODED_PARSE: unique symbol;
export declare const JSON_RESULT_OPTIONS: unique symbol;
