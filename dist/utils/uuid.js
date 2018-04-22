"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = require("uuid/v4");
class UUIDConstructor {
    Create() {
        return v4_1.default();
    }
}
exports.UUIDConstructor = UUIDConstructor;
exports.UUID = new UUIDConstructor();
//# sourceMappingURL=uuid.js.map