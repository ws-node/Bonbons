import { Controller, BaseController, Method, Route, Request, JsonResult } from "../../framework";
import { SuperService } from "../services/main";

@Controller("api")
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
    @Route("index")
    public ApiIndex(): JsonResult {
        console.log("this is a api method with query id : " + this.context.query("id", Number));
        console.log("this is a api method with query select : " + this.context.query("select", Boolean));
        console.log("this is a api method with query notexist : " + this.context.query("notexist"));
        return new JsonResult({ value: this.sup.print() });
    }

}