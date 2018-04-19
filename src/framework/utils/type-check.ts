
function isObject(target: any) {
    return Object.prototype.toString.call(target) === "[object Object]";
}

function isArray(target: any) {
    return Object.prototype.toString.call(target) === "[object Array]";
}

export class TypeCheck {

    public static IsObject(target: any) { return isObject(target); }

    public static IsArray(target: any) { return isArray(target); }

}