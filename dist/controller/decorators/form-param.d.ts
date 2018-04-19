/// <reference types="body-parser" />
import { BodyParser } from "../../metadata/core";
/** Get form message from body when type is [multiple/form-data] */
export declare function FormData(): any;
/** Get form message from body when default type is [multiple/form-data] */
export declare function FormData(type: string): any;
/** Get form message from body when type is [application/json] */
export declare function FromBody(): any;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(type: string): any;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(config: BodyParser.OptionsJson): any;
/** Get form message from body when type is [application/x-www-form-urlencoded] */
export declare function FromForm(): any;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FromForm(type: string): any;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FromForm(config: BodyParser.OptionsUrlencoded): any;
/** Get form message from body when type is [application/octet-stream] */
export declare function RawBody(): any;
/** Get form message from body when default type is [application/octet-stream] */
export declare function RawBody(type: string): any;
/** Get form message from body when default type is [application/octet-stream] */
export declare function RawBody(config: BodyParser.Options): any;
/** Get form message from body when type is [text/plain] */
export declare function TextBody(): any;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(type: string): any;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(config: BodyParser.OptionsText): any;
