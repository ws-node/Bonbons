import * as decamelize from "decamelize";
import * as camel from "camelcase";


export class Formater {

    public static ToCamelCase(str: string) {
        return (camel.default || camel)(str);
    }

    public static DeCamelCase(str: string, sec = "-") {
        return (decamelize.default || decamelize)(str, sec);
    }
}