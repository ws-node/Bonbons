import { ConfigKey, IOptions, IConfigContainer } from "../metadata/config";

export class ConfigContainer implements IConfigContainer {

    private maps = new Map<ConfigKey, any>();

    public set<K extends ConfigKey, V>(options: IOptions<K, V>) {
        this.maps.set(options.key, options.value);
    }

    public get(key: ConfigKey) {
        return this.maps.get(key) || null;
    }

}
