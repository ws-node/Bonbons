"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_1 = require("../metadata/reflect");
function getDependencies(target) {
    return Reflect.getMetadata(reflect_1.PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
//# sourceMappingURL=reflect.js.map