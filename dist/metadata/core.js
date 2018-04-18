"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
exports.BodyParser = bodyParser;
const multer = require("multer");
const { json, raw, text, urlencoded } = bodyParser;
exports.JSONParser = json;
exports.RawParser = raw;
exports.TextParser = text;
exports.URLEncodedParser = urlencoded;
const expressFn = express.default || express;
const multerFn = multer.default || multer;
exports.MultiplePartParser = multerFn;
/**
 * Create a express app.
 */
function CreateExpress() {
    return expressFn();
}
exports.CreateExpress = CreateExpress;
//# sourceMappingURL=core.js.map