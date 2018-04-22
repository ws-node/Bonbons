"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReadableSource {
    constructor(_data, _method) {
        this._data = _data;
        this._method = _method;
    }
    get data() {
        return this._method ?
            this._data[this._method]() :
            (this._data || {});
    }
    get(key, type) {
        return this._transform(this.data, key, type);
    }
    _transform(source, key, type) {
        return convertTo((source && (source[key])) || null, type);
    }
}
exports.ReadableSource = ReadableSource;
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