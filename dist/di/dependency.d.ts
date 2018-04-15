import { InjectScope } from "../metadata/injectable";
export interface DeptNode {
    el: any;
    realel: any;
    deps: any[];
    scope: InjectScope;
}
export declare class DependencyQueue {
    private queue;
    private sections;
    addNode(el: any, realel?: any, deps?: any[], scope?: InjectScope): void;
    sort(): DeptNode[];
    private decideSection(queue, sections, current);
}
