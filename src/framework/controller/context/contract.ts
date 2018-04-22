import { Request, Response, IConstructor } from "../../metadata";
import { IContext } from "../../metadata/controller";

// tslint:disable-next-line:ban-types
export type BaseCtor = Number | Boolean | String;

export interface IConvertable {
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}

export interface IReadable extends IConvertable {
    readonly data: any;
}

export interface IWritable extends IReadable {
    set(key: string, value: any): void;
}
