/// <reference types="body-parser" />
import { BodyParser } from ".";
export interface IBonbonsMetadata {
    bodyParseConfig: {
        json: BodyParser.OptionsJson;
        text: BodyParser.OptionsText;
        raw: BodyParser.Options;
        urlencoded: BodyParser.OptionsUrlencoded;
    };
}
