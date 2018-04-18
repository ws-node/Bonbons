"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./../metadata/core");
class Extensions {
    static UseJSONConvert(app, options) {
        app.use(core_1.JSONParser(options));
    }
    static UseRawConvert(app, options) {
        app.use(core_1.RawParser(options));
    }
    static UseTextConvert(app, options) {
        app.use(core_1.TextParser(options));
    }
    static UseEncodedConvert(app, options) {
        app.use(core_1.URLEncodedParser(options));
    }
}
exports.Extensions = Extensions;
//# sourceMappingURL=extensions.js.map