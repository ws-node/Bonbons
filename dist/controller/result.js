"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represent the json to send by response.
 */
class JsonResult {
    constructor(json) {
        this.json = json;
    }
    toString() { return JSON.stringify(this.json); }
}
exports.JsonResult = JsonResult;
//# sourceMappingURL=result.js.map