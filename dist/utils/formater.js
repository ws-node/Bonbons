"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decamelize = require("decamelize");
const camel = require("camelcase");
class Formater {
    static ToCamelCase(str) {
        return (camel.default || camel)(str);
    }
    static DeCamelCase(str, sec = "-") {
        return (decamelize.default || decamelize)(str, sec);
    }
}
exports.Formater = Formater;
//# sourceMappingURL=formater.js.map