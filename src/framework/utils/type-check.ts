
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

function isCustomClassInstance(obj) {
    return getPrototypeConstructor(obj) !== Object;
}

export class TypeCheckCreator {

    public IsObject(target: any) { return isObject(target); }

    public IsArray(target: any) { return isArray(target); }

    public getClass(target: any) { return getPrototypeConstructor(target); }

    public isFromCustomClass(target: any) { return isCustomClassInstance(target); }

}

export const TypeCheck = new TypeCheckCreator();
