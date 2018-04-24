import { Request, Response, IConstructor } from "../../metadata";
import { IContext } from "../../metadata/controller";

// tslint:disable-next-line:ban-types
export type BaseCtor = Number | Boolean | String;

export interface IData { [prop: string]: any; }
export type IDataInvoker = () => IData;

export type IReadableData = IData | IDataInvoker;

export interface IConvertable {
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}

export interface IReadable extends IConvertable {
    readonly data: IData;
}

export interface IWritable extends IReadable {
    set(key: string, value: any): void;
}
