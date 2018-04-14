
export interface IInjectable {
    dependencies: Array<any>;
}

export enum InjectScope {
    Singleton = "__singleton",
    Scoped = "__scoped"
}