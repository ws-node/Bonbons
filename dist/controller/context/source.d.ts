import { BaseCtor, IReadable } from "./contract";
import { IConstructor } from "../../metadata/core";
export declare class ReadableSource implements IReadable {
    private _data;
    private _method;
    readonly data: any;
    constructor(_data: {
        [key: string]: any;
    }, _method?: string);
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
    protected _transform(source: any, key: string): string;
    protected _transform<T extends BaseCtor>(source: any, key: string, type: IConstructor<T>): T;
}
export declare function convertTo(value: any, type: any): any;
