import {
    Controller, BaseController, Method,
    Route, Request, JsonResult,
    Middleware, FromForm, FromBody,
    FormURL
} from "../../framework";
import { SuperService } from "../services/main";

@Controller("api")
@Middleware([middleware01])
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET")
    @Route("/index")
    public GetIndex(): string {
        console.log("this is a get method with base : ");
        return this.sup.print();
    }

    @Method("GET", "POST")
    @Route("index", ["id", "select", "msg"])
    @Middleware([middleware02], false)
    public ApiIndex(id: number, select: boolean, msg): JsonResult {
        console.log(id);
        console.log(select);
        console.log(msg);
        console.log(typeof id);
        console.log(typeof select);
        console.log(typeof msg);
        console.log("this is a api method with query id : " + this.context.query("id", Number));
        console.log("this is a api method with query select : " + this.context.query("select", Boolean));
        console.log("this is a api method with query notexist : " + this.context.query("notexist"));
        return this.toJSON({ value: this.sup.print() });
    }

    @Method("POST")
    @Route("post")
    @Middleware([], false)
    public POSTIndex(name: string, @FromBody() params: any): JsonResult {
        console.log("this is a post method");
        const form = this.context.form;
        console.log(form.data);
        console.log(params);
        return this.toJSON(params);
    }

}

function middleware01(r, rs, next) {
    console.log("123456");
    next();
}

function middleware02(r, rs, next) {
    console.log("555555");
    next();
}