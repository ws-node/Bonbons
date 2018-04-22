import {
    serialize, deserialize, serializeAs,
    deserializeAs, inheritSerialization, Serialize,
    Deserialize, GenericDeserialize
} from "cerialize";
import { IConstructor } from "../metadata/core";
import { IStaticTypedResolver } from "../metadata/static";

export class TypedSerializerCreator implements IStaticTypedResolver {

    public ToJSON(obj: any, format = false): string {
        return JSON.stringify(Serialize(obj), null, format ? "\t" : 0);
    }

    // tslint:disable-next-line:ban-types
    public FromJSON<T>(json: string, type?: IConstructor<T>): T {
        return !type ?
            Deserialize(JSON.parse(json)) as T :
            GenericDeserialize(JSON.parse(json), type) as T;
    }

    public ToObject(obj: any, format = false): any {
        return Serialize(obj);
    }

    // tslint:disable-next-line:ban-types
    public FromObject<T>(json: any, type?: IConstructor<T>): T {
        return !type ?
            Deserialize(json) as T :
            GenericDeserialize(json, type) as T;
    }

}

export const TypedSerializer = new TypedSerializerCreator();

export {
    serializeAs as Serialize,
    deserializeAs as Deserialize,
    inheritSerialization as Extends
};