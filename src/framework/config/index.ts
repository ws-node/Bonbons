import { ConfigKey, IOptions, IConfigContainer } from "../metadata/config";

export class ConfigContainer implements IConfigContainer {

    private maps = new Map<symbol, any>();

    public set<V>(options: IOptions<V>) {
        this.maps.set(options.key.key, options.value);
    }

    public get<V>(key: ConfigKey<V>): V {
        return this.maps.get(key && key.key) || null;
    }

}
