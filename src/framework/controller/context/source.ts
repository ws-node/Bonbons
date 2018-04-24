import { BaseCtor, IReadable, IReadableData, IData, IDataInvoker, IWritable } from "./contract";
import { IConstructor } from "../../metadata/core";

export class ReadableSource implements IReadable {

    private _isFucData = false;
    protected get dataType() { return !!this._isFucData ? 2 : 1; }

    private _data: IData;
    private _dataIvk: IDataInvoker;
    public get data() { return !!this._isFucData ? this._dataIvk() : this._data; }

    constructor(_data: IReadableData) {
        if (this._isFucData = (Object.prototype.toString.call(_data) === "[object Function]")) {
            this._dataIvk = <IDataInvoker>_data;
        } else {
            this._data = _data;
        }
    }

    public get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return this._transform(this.data, key, <IConstructor<T>>type);
    }

    private _transform(source: any, key: string): string;
    private _transform<T extends BaseCtor>(source: any, key: string, type: IConstructor<T>): T;
    private _transform<T extends BaseCtor>(source: any, key: string, type?: IConstructor<T>): T {
        return convertTo((source && (source[key])) || null, type);
    }

}

export class WritableSource extends ReadableSource implements IWritable {

    constructor(_data: IReadableData, setter?: (k: string, v) => void) {
        super(_data);
        if (setter) {
            this.set = setter;
        }
    }

    public set(key: string, value: any) {
        if (this.dataType === 1) {
            this.data[key] = value;
        }
    }

}

export function convertTo(value: any, type: any) {
    if (type && value) {
        try {
            return type(value);
        } catch (e) {
            throw new Error(`Type convert failed : can't convert value [${value}] to [${type}]`);
        }
    } else {
        return value;
    }
}