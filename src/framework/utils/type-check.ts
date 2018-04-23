
function isObject(target: any) {
    return Object.prototype.toString.call(target) === "[object Object]";
}

function isArray(target: any) {
    return Object.prototype.toString.call(target) === "[object Array]";
}

function getPrototypeConstructor(obj) {
    const proto = Object.getPrototypeOf(obj);
    return proto && proto.constructor;
}

function isCustomClassInstance(obj: any, type?: any) {
    return !type ?
        (getPrototypeConstructor(obj) !== Object) :
        (getPrototypeConstructor(obj) === type);
}

export class TypeCheckCreator {

    public IsObject(target: any) { return isObject(target); }

    public IsArray(target: any) { return isArray(target); }

    public getClass(target: any) { return getPrototypeConstructor(target); }

    public isFromCustomClass(target: any, type?: any) { return isCustomClassInstance(target, type); }

}

export const TypeCheck = new TypeCheckCreator();
