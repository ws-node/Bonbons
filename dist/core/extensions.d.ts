/// <reference types="body-parser" />
import { Express, BodyParser } from "./../metadata/core";
export declare class Extensions {
    static UseJSONConvert(app: Express, options?: BodyParser.OptionsJson): void;
    static UseRawConvert(app: Express, options?: BodyParser.Options): void;
    static UseTextConvert(app: Express, options?: BodyParser.OptionsText): void;
    static UseEncodedConvert(app: Express, options?: BodyParser.OptionsUrlencoded): void;
}
