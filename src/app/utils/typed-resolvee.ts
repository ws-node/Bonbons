import { IStaticTypedResolver, IConstructor } from "../../framework";

export class MyTypedSerializerCreator implements IStaticTypedResolver {

    public ToJSON(obj: any, format = false): string {
        return JSON.stringify(obj, null, format ? "\t" : 0);
    }

    // tslint:disable-next-line:ban-types
    public FromJSON<T>(json: string, type?: IConstructor<T>): T {
        return JSON.parse(json) as T;
    }

    public ToObject(obj: any, format = false): any {
        return obj;
    }

    // tslint:disable-next-line:ban-types
    public FromObject<T>(json: any, type?: IConstructor<T>): T {
        return json;
    }

}