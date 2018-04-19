import "reflect-metadata";
import { IControllerMetadata, IRoute } from "../../metadata/controller";
export declare function initRoutes(reflect: IControllerMetadata, propertyKey: string): IRoute;
export declare function reroute(reflect: IControllerMetadata, propertyKey: string, payload: any): IControllerMetadata;
