"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injectable_1 = require("../metadata/injectable");
class DependencyQueue {
    constructor() {
        this.queue = [];
        this.sections = [];
    }
    addNode(el, realel, deps, scope) {
        const found = this.queue.find(i => i.el === el);
        if (found)
            return;
        deps = deps || [];
        scope = scope || injectable_1.InjectScope.Singleton;
        this.queue.push({ el, realel: realel || el, deps, scope });
    }
    sort() {
        this.sections[0] = this.queue.filter(i => i.deps.length === 0);
        this.decideSection(this.queue.filter(i => i.deps.length > 0), this.sections, 1);
        return this.sections.reduce((pre, cur, idx, arr) => ([...pre, ...cur]));
    }
    decideSection(queue, sections, current) {
        if (queue.length === 0)
            return;
        const wants = queue.filter(item => resolveUnder(item, sections, current - 1, this.queue));
        if (wants.length === 0)
            return;
        sections[current] = wants;
        this.decideSection(queue.filter(i => !wants.includes(i)), sections, current + 1);
    }
}
exports.DependencyQueue = DependencyQueue;
function resolveUnder(node, sections, checkIndex, sourceQueue) {
    const checkArr = [];
    if (checkIndex < 0)
        return false;
    let index = checkIndex;
    while (index >= 0) {
        checkArr.push(...sections[index]);
        index--;
    }
    const isresolved = node.deps.every(i => checkArr.map(m => m.el).includes(i));
    if (!isresolved && !node.deps.every(i => sourceQueue.map(m => m.el).includes(i)))
        throw resolveError(node.realel, node.deps);
    return isresolved;
}
function resolveError(el, depts) {
    return new Error(`resolve dependency error : the dependency queue is broken caused by [${(el && el.name) || "unknown name"}]. ` +
        `the depedency list is [${(depts || []).map(i => i.name || "??").join(", ")}]`);
}
//# sourceMappingURL=dependency.js.map