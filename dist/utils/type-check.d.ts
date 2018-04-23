export declare class TypeCheckCreator {
    IsObject(target: any): boolean;
    IsArray(target: any): boolean;
    getClass(target: any): any;
    isFromCustomClass(target: any, type?: any): boolean;
}
export declare const TypeCheck: TypeCheckCreator;
