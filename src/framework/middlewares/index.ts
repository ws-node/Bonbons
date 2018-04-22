import { Request, Response, ICommonMidleware } from "./../metadata";

export function NewXPoweredBy(value: string): ICommonMidleware {
    return function (req: Request, rep: Response, next) {
        rep.setHeader("x-powered-by", value);
        next();
    };
}