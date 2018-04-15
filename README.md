# PROJECT Bonbons
> a static-typed express framework with typescript.

This is an MVC framework based on node.js and express. The framework is created by typescript, which includes a dependency injection system and RESTful high-level abstraction.

The core features are under development. Currently, the dependency injection system is basically completed, the controller module is basically completed, and the GET method is also completed. **Other features are still developing**.

## How it works?
#### 1. Create a service and register
```TypeScript
@Injectabe()
export class SecService {
    constructor() {}
    print(){
        return "hello world!";
    }
}

...

// register a scoped-service
Server.Create().scoped(SecService);
// or register a singleton-service
Server.Create().singleton(SecService);
```

#### 2. Create a controller and register 
```TypeScript
@Controller("api")
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET")
    @Route("/index")
    public GetIndex(): string {
        return "this is a get method with base : ";
    }

    @Method("GET", "POST")
    @Route("index")
    public ApiIndex(): JsonResult {
        console.log("this is a api method with query id : " + this.context.query("id", Number));
        console.log("this is a api method with query select : " + this.context.query("select", Boolean));
        console.log("this is a api method with query notexist : " + this.context.query("notexist"));
        return new JsonResult({ value: "this is a api method with base : " });
    }

}

...

// register controller
Server.Create()
    .scoped(SecService)
    .controller(MainController);
```

3. Use ABC to split dependency
```TypeScript
// define a ABC
export abstract class ABCService {
    public abstract getMessage(): string;
}

// then extends ABC and implements methods
@Injectabe()
export class MainService extends ABCService {

    private id = UUID.Create();

    constructor(sec: SecService) {
        super();
    }

    public getMessage(): string {
        return this.id;
    }

}

...

// finally inject it
Server.Create()
    .controller(MainController)
    .scoped(SecService)
    .scoped(ABCService, MainService)

// now you can split the dependency by ABC injection
export class SuperService {

    constructor(private sec: SecService, private main: ABCService) {

    }

    print() {
        return "Hello World! " + this.main.getMessage();
    }

}

// it works!
```

**Still in developing...**

