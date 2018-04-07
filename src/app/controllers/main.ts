import { Controller, BaseController, Method, Route, Request } from "../../framework";

@Controller()
export class MainController extends BaseController {

    @Method("GET", "POST")
    @Route("/index")
    public Get(request: Request, response) {
        console.log("this is a get method with base : " + request.baseUrl);
        response.send("Hello World!");
    }

}