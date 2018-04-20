import { Bonbons, JSON_RESULT_OPTIONS } from "./../framework";
import { MainController } from "./controllers/main";
import { MainService, SecService, SuperService, ABCService } from "./services/main";

Bonbons.Create()
    .controller(MainController)
    .singleton(SecService)
    .scoped(SuperService)
    .scoped(ABCService, MainService)
    .useOptions(JSON_RESULT_OPTIONS, { indentation: true, staticType: true })
    .listen(3000)
    .run(() => console.log("Example app listening on port 3000"));
