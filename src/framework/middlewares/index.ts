import { Request, Response } from "./../metadata";

export function NewXPoweredBy(value: string): (req: Request, rep: Response, next) => void {
    return function (req: Request, rep: Response, next) {
        rep.setHeader("x-powered-by", value);
        next();
    };
}