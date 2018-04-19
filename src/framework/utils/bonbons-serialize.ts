import { serialize, deserialize, serializeAs, deserializeAs, inheritSerialization, Serialize, Deserialize, INewable, ISerializable } from "cerialize";

export class TypedSerializer {

    public static ToJSON(obj: any, format = false): string {
        return JSON.stringify(Serialize(obj), null, format ? "\t" : 0);
    }

    // tslint:disable-next-line:ban-types
    public static FromJSON<T>(json: string, type?: Function | INewable<T> | ISerializable): T {
        return Deserialize(JSON.parse(json), type) as T;
    }

}

export {
    serializeAs as Serialization,
    deserializeAs as Deserialization,
    inheritSerialization as Extends,
    Serialize,
    Deserialize
};