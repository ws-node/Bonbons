import { InjectScope } from "../metadata/injectable";
import { getDependencies } from "./reflect";
import { DependencyQueue } from "./dependency";

class DIEntry {
    _instance: any;
    _fac?: any;
    constructor(private scope: InjectScope) { }
    getInstance() {
        return this.scope === InjectScope.Singleton ? (this._instance || (this._instance = this._fac())) : this._fac();
    }
}

export class DIContainer {

    private deps_queue = new DependencyQueue();
    private maps = new Map<any, DIEntry>();

    public get(selector: any) {
        const value = this.maps.get(selector);
        if (!value) throw resolveError(selector);
        return value.getInstance();
    }

    public resolveDeps(value) {
        return getDependencies(value).map(dep => this.get(dep));
    }

    public register(selector: any, value: any, scope: InjectScope) {
        this.deps_queue.addNode(selector, value, getDependencies(value), scope);
    }

    public complete() {
        const finals = this.deps_queue.sort();
        finals.forEach(node => {
            const exist = this.maps.get(node.el);
            if (exist) throw registerError(node.el);
            const entry = new DIEntry(node.scope);
            entry._fac = () => new node.realel(...node.deps.map(dep => this.get(dep)));
            this.maps.set(node.el, entry);
        });
    }

}

function registerError(selector: any) {
    return new Error(`injectable register error : injectable element with name [${(selector && selector.name) || "unknown name"}] is exist already.`);
}

function resolveError(selector: any) {
    return new Error(`resolve injectable dependencies error : can not resolve dept name [${(selector && selector.name) || "unknown name"}] .`);
}

