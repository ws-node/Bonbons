import { InjectScope } from "../metadata/injectable";
export declare class DIContainer {
    private deps_queue;
    private maps;
    get(selector: any): any;
    resolveDeps(value: any): any[];
    register(selector: any, value: any, scope: InjectScope): void;
    complete(): void;
}
