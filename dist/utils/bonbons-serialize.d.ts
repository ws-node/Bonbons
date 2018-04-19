import { serializeAs, deserializeAs, inheritSerialization, Serialize, Deserialize, INewable, ISerializable } from "cerialize";
export declare class TypedSerializer {
    static ToJSON(obj: any, format?: boolean): string;
    static FromJSON<T>(json: string, type?: Function | INewable<T> | ISerializable): T;
}
export { serializeAs as Serialization, deserializeAs as Deserialization, inheritSerialization as Extends, Serialize, Deserialize };
