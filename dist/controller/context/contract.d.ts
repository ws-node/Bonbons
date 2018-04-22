import { IConstructor } from "../../metadata";
export declare type BaseCtor = Number | Boolean | String;
export interface IConvertable {
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
}
export interface IReadable extends IConvertable {
    readonly data: any;
}
export interface IWritable extends IReadable {
    set(key: string, value: any): void;
}
