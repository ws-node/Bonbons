"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cerialize_1 = require("cerialize");
exports.Serialize = cerialize_1.serializeAs;
exports.Deserialize = cerialize_1.deserializeAs;
exports.Extends = cerialize_1.inheritSerialization;
class TypedSerializer {
    static ToJSON(obj, format = false) {
        return JSON.stringify(cerialize_1.Serialize(obj), null, format ? "\t" : 0);
    }
    // tslint:disable-next-line:ban-types
    static FromJSON(json, type) {
        return !type ?
            cerialize_1.Deserialize(JSON.parse(json)) :
            cerialize_1.GenericDeserialize(JSON.parse(json), type);
    }
    static ToObject(obj, format = false) {
        return cerialize_1.Serialize(obj);
    }
    // tslint:disable-next-line:ban-types
    static FromObject(json, type) {
        return !type ?
            cerialize_1.Deserialize(json) :
            cerialize_1.GenericDeserialize(json, type);
    }
}
exports.TypedSerializer = TypedSerializer;
//# sourceMappingURL=bonbons-serialize.js.map