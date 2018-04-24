import { BaseCtor, IReadable, IReadableData, IData, IWritable } from "./contract";
import { IConstructor } from "../../metadata/core";
export declare class ReadableSource implements IReadable {
    private _isFucData;
    protected readonly dataType: number;
    private _data;
    private _dataIvk;
    readonly data: IData;
    constructor(_data: IReadableData);
    get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T;
    private _transform(source, key);
    private _transform<T>(source, key, type);
}
export declare class WritableSource extends ReadableSource implements IWritable {
    constructor(_data: IReadableData, setter?: (k: string, v) => void);
    set(key: string, value: any): void;
}
export declare function convertTo(value: any, type: any): any;
