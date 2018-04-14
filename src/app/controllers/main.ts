import { Controller, BaseController, Method, Route, Request } from "../../framework";
import { SuperService } from "../services/main";

@Controller()
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET", "POST")
    @Route("/index")
    public Get() {
        console.log("this is a get method with base : ");
        this.response.send(this.sup.print());
    }

}