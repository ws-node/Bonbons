import { serializeAs, deserializeAs, inheritSerialization, INewable } from "cerialize";
export declare class TypedSerializer {
    static ToJSON(obj: any, format?: boolean): string;
    static FromJSON<T>(json: string, type?: INewable<T>): T;
    static ToObject(obj: any, format?: boolean): any;
    static FromObject<T>(json: any, type?: INewable<T>): T;
}
export { serializeAs as Serialize, deserializeAs as Deserialize, inheritSerialization as Extends };
