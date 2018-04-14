import { Server } from "./../framework";
import { MainController } from "./controllers/main";
import { MainService, SecService, SuperService, ABCService } from "./services/main";

Server
    .controller(MainController)
    .injectable(SecService)
    .injectable(SuperService)
    .injectable(ABCService, MainService)
    .listen(3000)
    .run(() => console.log("Example app listening on port 3000"));
