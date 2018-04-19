import { BodyParser } from ".";

export interface IBodyParseMetadata {
    json: BodyParser.OptionsJson;
    text: BodyParser.OptionsText;
    raw: BodyParser.Options;
    urlencoded: BodyParser.OptionsUrlencoded;
}