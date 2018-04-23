import { Request, Response, ICommonMidleware } from "./../metadata";

export * from "./pipe";

export function NewXPoweredBy(value: string): ICommonMidleware {
    return function (req: Request, rep: Response, next?: () => void) {
        rep.setHeader("x-powered-by", value);
        next && next();
    };
}