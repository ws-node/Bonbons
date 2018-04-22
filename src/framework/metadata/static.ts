import { IConstructor } from "./core";

export interface IStaticTypedResolver {
    ToJSON(obj: any, format?: boolean): string;
    FromJSON<T>(json: string, type?: IConstructor<T>): T;
    ToObject(obj: any, format?: boolean): any;
    FromObject<T>(json: any, type?: IConstructor<T>): T;
}