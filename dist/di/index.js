"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injectable_1 = require("../metadata/injectable");
const reflect_1 = require("./reflect");
const dependency_1 = require("./dependency");
class DIEntry {
    constructor(scope) {
        this.scope = scope;
    }
    getInstance() {
        return this.scope === injectable_1.InjectScope.Singleton ? (this._instance || (this._instance = this._fac())) : this._fac();
    }
}
class DIContainer {
    constructor() {
        this.deps_queue = new dependency_1.DependencyQueue();
        this.maps = new Map();
    }
    get(selector) {
        const value = this.maps.get(selector);
        if (!value)
            throw resolveError(selector);
        return value.getInstance();
    }
    resolveDeps(value) {
        return reflect_1.getDependencies(value).map(dep => this.get(dep));
    }
    register(selector, value, scope) {
        this.deps_queue.addNode(selector, value, reflect_1.getDependencies(value), scope);
    }
    complete() {
        const finals = this.deps_queue.sort();
        finals.forEach(node => {
            const exist = this.maps.get(node.el);
            if (exist)
                throw registerError(node.el);
            const entry = new DIEntry(node.scope);
            const isConstructor = !!node.realel.prototype;
            entry._fac = () => (isConstructor ? new node.realel(...node.deps.map(dep => this.get(dep))) : node.realel);
            this.maps.set(node.el, entry);
        });
    }
}
exports.DIContainer = DIContainer;
function registerError(selector) {
    return new Error(`injectable register error : injectable element with name [${(selector && selector.name) || "unknown name"}] is exist already.`);
}
function resolveError(selector) {
    return new Error(`resolve injectable dependencies error : can not resolve dept name [${(selector && selector.name) || "unknown name"}] .`);
}
//# sourceMappingURL=index.js.map