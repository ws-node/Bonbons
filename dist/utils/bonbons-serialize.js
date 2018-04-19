"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cerialize_1 = require("cerialize");
exports.Serialization = cerialize_1.serializeAs;
exports.Deserialization = cerialize_1.deserializeAs;
exports.Extends = cerialize_1.inheritSerialization;
exports.Serialize = cerialize_1.Serialize;
exports.Deserialize = cerialize_1.Deserialize;
class TypedSerializer {
    static ToJSON(obj, format = false) {
        return JSON.stringify(cerialize_1.Serialize(obj), null, format ? "\t" : 0);
    }
    // tslint:disable-next-line:ban-types
    static FromJSON(json, type) {
        return cerialize_1.Deserialize(JSON.parse(json), type);
    }
}
exports.TypedSerializer = TypedSerializer;
//# sourceMappingURL=bonbons-serialize.js.map