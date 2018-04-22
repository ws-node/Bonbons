import { serializeAs, deserializeAs, inheritSerialization } from "cerialize";
import { IConstructor } from "../metadata/core";
import { IStaticTypedResolver } from "../metadata/static";
export declare class TypedSerializerCreator implements IStaticTypedResolver {
    ToJSON(obj: any, format?: boolean): string;
    FromJSON<T>(json: string, type?: IConstructor<T>): T;
    ToObject(obj: any, format?: boolean): any;
    FromObject<T>(json: any, type?: IConstructor<T>): T;
}
/**
 * Bonbons built-in static type contract serialization tool (based on cerialize)
 */
export declare const TypedSerializer: TypedSerializerCreator;
export { serializeAs as Serialize, deserializeAs as Deserialize, inheritSerialization as Extends };
