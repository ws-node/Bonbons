import * as iconv from "iconv-lite";

import { IMethodResult, IConfigContainer, StringResultOptions, STRING_RESULT_OPTIONS } from "./../../metadata";

export class StringResult implements IMethodResult {

    private options: StringResultOptions;

    constructor(private value: string, options?: StringResultOptions) {
        this.options = options || {};
    }

    public toString(configs: IConfigContainer): string {
        const options: StringResultOptions = Object.assign(configs.get(STRING_RESULT_OPTIONS) || {}, this.options || {});
        const from = (options.fromEncoding || "UTF8").toLowerCase();
        const to = (options.toEncoding || "UTF8").toLowerCase();
        console.log(`ENCODING : [ ${from} ] - [ ${to} ]`);
        console.log(this.value);
        console.log(iconv.decode(iconv.encode(this.value, from), to));
        return iconv.decode(iconv.encode(this.value, from), to);
    }

}