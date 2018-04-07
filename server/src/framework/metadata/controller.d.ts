export declare type AllowMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export interface IController {
    routes: Array<IRoute>;
    registerRoute(methodName: string, config: any): void;
}
export interface IRoute {
    path?: string;
    methodName: string;
    allowMethods: AllowMethod[];
}
