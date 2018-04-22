import { ConfigKey, IOptions, IConfigContainer } from "../metadata/config";
export declare class ConfigContainer implements IConfigContainer {
    private maps;
    set<V>(options: IOptions<V>): void;
    get<V>(key: ConfigKey<V>): V;
}
