import { Express, BodyParser, JSONParser, RawParser, TextParser, URLEncodedParser } from "./../metadata/core";

export class Extensions {

    public static UseJSONConvert(app: Express, options?: BodyParser.OptionsJson) {
        app.use(JSONParser(options));
    }

    public static UseRawConvert(app: Express, options?: BodyParser.Options) {
        app.use(RawParser(options));
    }

    public static UseTextConvert(app: Express, options?: BodyParser.OptionsText) {
        app.use(TextParser(options));
    }

    public static UseEncodedConvert(app: Express, options?: BodyParser.OptionsUrlencoded) {
        app.use(URLEncodedParser(options));
    }

}