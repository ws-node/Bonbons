"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * Define a injectable class for IoC container.
 * You can get the instance by Constructor Injection in constoller or another injectable class instance.
 */
function Injectabe(config) {
    return function (target) {
        // Do Nothing
        return target;
    };
}
exports.Injectabe = Injectabe;
//# sourceMappingURL=decorators.js.map