import { ConfigKey, IOptions, IConfigContainer } from "../metadata/config";
export declare class ConfigContainer implements IConfigContainer {
    private maps;
    set<K extends ConfigKey, V>(options: IOptions<K, V>): void;
    get(key: ConfigKey): any;
}
