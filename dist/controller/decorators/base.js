"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function initRoutes(reflect, propertyKey) {
    return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = {});
}
exports.initRoutes = initRoutes;
function reroute(reflect, propertyKey, payload) {
    Object.assign(initRoutes(reflect, propertyKey), payload);
    return reflect;
}
exports.reroute = reroute;
//# sourceMappingURL=base.js.map