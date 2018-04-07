import { Server } from "./../framework";
import { MainController } from "./controllers/main";

Server
    .controller(MainController)
    .listen(3000)
    .run(() => console.log("Example app listening on port 3000"));
