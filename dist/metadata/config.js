"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Create a configuration container options */
function createOptions(key, value) {
    return ({ key, value });
}
exports.createOptions = createOptions;
/**
 * Create a unique key for registering in the configuration container
 * @param key value
 */
function createConfigKey(key) { return { key: Symbol("__bonbons:" + key) }; }
exports.createConfigKey = createConfigKey;
exports.BODY_JSON_PARSER = createConfigKey("body_json_parse");
exports.BODY_RAW_PARSER = createConfigKey("body_raw_parse");
exports.BODY_TEXT_PARSER = createConfigKey("body_text_parse");
exports.BODY_URLENCODED_PARSER = createConfigKey("body_urlencoded_parse");
exports.STATIC_TYPED_RESOLVER = createConfigKey("static_typed_resolver");
exports.JSON_RESULT_OPTIONS = createConfigKey("json_result_options");
exports.STRING_RESULT_OPTIONS = createConfigKey("string_result_options");
exports.X_POWERED_BY = createConfigKey("x-powered-by");
//# sourceMappingURL=config.js.map