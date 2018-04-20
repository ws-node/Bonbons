import {
    serialize, deserialize, serializeAs,
    deserializeAs, inheritSerialization, Serialize,
    Deserialize, INewable, ISerializable,
    GenericDeserialize
} from "cerialize";

export class TypedSerializer {

    public static ToJSON(obj: any, format = false): string {
        return JSON.stringify(Serialize(obj), null, format ? "\t" : 0);
    }

    // tslint:disable-next-line:ban-types
    public static FromJSON<T>(json: string, type?: INewable<T>): T {
        return !type ?
            Deserialize(JSON.parse(json)) as T :
            GenericDeserialize(JSON.parse(json), type) as T;
    }

    public static ToObject(obj: any, format = false): any {
        return Serialize(obj);
    }

    // tslint:disable-next-line:ban-types
    public static FromObject<T>(json: any, type?: INewable<T>): T {
        return !type ?
            Deserialize(json) as T :
            GenericDeserialize(json, type) as T;
    }

}

export {
    serializeAs as Serialize,
    deserializeAs as Deserialize,
    inheritSerialization as Extends
};