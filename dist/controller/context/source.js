"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReadableSource {
    constructor(_data) {
        this._isFucData = false;
        if (this._isFucData = (Object.prototype.toString.call(_data) === "[object Function]")) {
            this._dataIvk = _data;
        }
        else {
            this._data = _data;
        }
    }
    get dataType() { return !!this._isFucData ? 2 : 1; }
    get data() { return !!this._isFucData ? this._dataIvk() : this._data; }
    get(key, type) {
        return this._transform(this.data, key, type);
    }
    _transform(source, key, type) {
        return convertTo((source && (source[key])) || null, type);
    }
}
exports.ReadableSource = ReadableSource;
class WritableSource extends ReadableSource {
    constructor(_data, setter) {
        super(_data);
        if (setter) {
            this.set = setter;
        }
    }
    set(key, value) {
        if (this.dataType === 1) {
            this.data[key] = value;
        }
    }
}
exports.WritableSource = WritableSource;
function convertTo(value, type) {
    if (type && value) {
        try {
            return type(value);
        }
        catch (e) {
            throw new Error(`Type convert failed : can't convert value [${value}] to [${type}]`);
        }
    }
    else {
        return value;
    }
}
exports.convertTo = convertTo;
//# sourceMappingURL=source.js.map