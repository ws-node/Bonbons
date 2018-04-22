import { BaseCtor, IReadable } from "./contract";
import { IConstructor } from "../../metadata/core";

export class ReadableSource implements IReadable {

    public get data() {
        return this._method ?
            this._data[this._method]() :
            (this._data || {});
    }

    constructor(private _data: { [key: string]: any }, private _method?: string) { }

    public get<T extends BaseCtor>(key: string, type?: IConstructor<T>): T {
        return this._transform(this.data, key, <IConstructor<T>>type);
    }

    protected _transform(source: any, key: string): string;
    protected _transform<T extends BaseCtor>(source: any, key: string, type: IConstructor<T>): T;
    protected _transform<T extends BaseCtor>(source: any, key: string, type?: IConstructor<T>): T {
        return convertTo((source && (source[key])) || null, type);
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