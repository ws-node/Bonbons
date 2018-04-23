import {
    Controller, BaseController, Method,
    Route, Request, JsonResult,
    Middleware, FromForm, FromBody,
    FormData, JsonResultResolvers, Async,
    ConfigContainer,
    StringResult,
    Pipes
} from "../../framework";
import { SuperService } from "../services/main";
import { PostModel } from "../models/main.model";
import { TestPipe } from "../pipes/new.pipe";

@Controller("api")
@Middleware([middleware01])
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET")
    @Route("/index")
    public async GetIndex(): Async<StringResult> {
        console.log("this is a get method with base : ");
        // async mock
        await this.sleep(20);
        console.log("step 01");
        await this.sleep(20);
        console.log("step 02");
        await this.sleep(20);
        console.log("step 03");
        await this.sleep(20);
        console.log("step 04");
        await this.sleep(20);
        console.log("step 05");
        return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
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
    @Route("post/:id/details/:name", ["query", "find"])
    @Middleware([], false)
    @Pipes([TestPipe])
    public POSTIndex(
        id: number,
        name: string,
        query: string,
        find: string,
        @FromBody() params: PostModel): JsonResult {

        console.log("this is a post method");
        console.log(`${id} - ${name} - ${query} - ${find}`);
        console.log(`${typeof id} - ${typeof name} - ${typeof query} - ${typeof find}`);
        console.log(params);
        console.log(Object.getPrototypeOf(params).constructor.name);
        console.log(this.context.form.get("NAME_TEST"));
        console.log(this.context.request.headers.get("content-type"));

        console.log(this.context.response.headers.get("x-powered-by"));
        this.context.response.headers.set("woshinidie", true);

        return this.toJSON({
            theRequestHeaders: this.context.request.headers.data,
            theResponseHeaders: this.context.response.headers.data,
            theParams: params,
            theName: name,
            theQuery: query,
            theId: id,
            theFind: find
        }, { resolver: JsonResultResolvers.decamalize });
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