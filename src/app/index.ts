import { Bonbons, JSON_RESULT_OPTIONS, X_POWERED_BY } from "./../framework";
import { MainController } from "./controllers/main";
import { MainService, SecService, SuperService, ABCService } from "./services/main";
import { STATIC_TYPED_RESOLVER } from ".././framework";
import { MyTypedSerializerCreator } from "./utils/typed-resolvee";

Bonbons.Create()
    .controller(MainController)
    .singleton(SecService)
    .scoped(SuperService)
    .scoped(ABCService, MainService)
    .useOptions(JSON_RESULT_OPTIONS, { indentation: true, staticType: true })
    // .useOptions(X_POWERED_BY, "wogunnima")
    // .useOptions(STATIC_TYPED_RESOLVER, new MyTypedSerializerCreator())
    .listen(3000)
    .run(() => console.log("Example app listening on port 3000"));
