# PROJECT Bonbons
> a static-typed express framework with typescript.

This is an MVC framework based on node.js and express. The framework is created by typescript, which includes a dependency injection system and RESTful high-level abstraction.

The core features are under development. Currently, the dependency injection system is basically completed, the controller module is basically completed, and the GET method is also completed. 

**Other features are still developing**.

[More about Bonbons](https://github.com/mogician-notes/blog/issues/3)

## Installation
```powershell
npm install bonbons --save
```

## How it works?
#### 1. Create a service and register
```JavaScript
@Injectabe()
export class SecService {
    constructor() {}
    print(){
        return "hello world!";
    }
}

...

// register a scoped-service
Bonbons.Create().scoped(SecService);
// or register a singleton-service
Bonbons.Create().singleton(SecService);
```

#### 2. Create a controller and register 
```JavaScript
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

    @Method("GET")
    @Route("page", ["id", "select", "message"]) 
    // provide query params name list to open static query feature
    // example : localhost/api/page?id=123456&select=true&message=mmmmmm
    public AnotherGET(id:number, select:boolean, message): JsonResult {
        console.log(id); // 123456
        console.log(select); // true
        console.log(message) // "mmmmmm" (string is the default type)
        console.log(typeof id); // number
        console.log(typeof select); // boolean
        console.log(typeof message); // string
        return new JsonResult({ value: "666666" });
    }

}

...

// register controller
Bonbons.Create()
    .scoped(SecService)
    .controller(MainController);
```

#### 3. Use ABC to split dependency
```JavaScript
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
Bonbons.Create()
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

#### 4. Add middlewares or pipe for route or controller
```JavaScript
// 1 : Middlewares like express style
// first create middleware in pure function format.
function middleware01(r, rs, next) {
    console.log("123456");
    next();
}
function middleware02(r, rs, next) {
    console.log("555555");
    next();
}

// then add it to method by decorator
@Method("GET", "POST")
@Route("index")
@Middleware([middleware02])
public ApiIndex(): JsonResult {
    return new JsonResult({ value: this.sup.print() });
}

// this decorator is alse can be add in controller
// the middlewares add to controller will add to all the registeres methods, but you can still rewrite this behavior.
@Controller("api")
@Middleware([middleware01])
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET")
    @Route("/index")
    // will extends controller middlewares list : [middleware01]
    public GetIndex(): string {
        return this.sup.print();
    }

    @Method("GET", "POST")
    @Route("index")
    @Middleware([middleware02], false) 
    // merge:true(default), will extends controller middlewares list : [middleware01, middleware02]
    // merge:false, will not extends controller middlewares list : [middleware02]
    public ApiIndex(): JsonResult {
        return new JsonResult({ value: this.sup.print() });
    }

}

// 2. Bonbons pipes
export class RandomBreak extends MiddlewarePipe {

    constructor() { super(); }

    async process(): Promise<void> {
        this.context.locals.set("woshinidie", 1024);
        await this.sleep(100);
        const k = parseInt((Math.random() * 100).toString(), 10) % 2 === 1;
        console.log(k);
        if (k) {
            this.throws("哈哈哈哈哈哈哈哈，崩溃了吧");
        }
    }

}

// then add to route method
 @Method("GET")
    @Route("/index")
    @Pipes([RandomBreak])
    public async GetIndex(): StringResult {
        console.log("this is a get method with base : ");
        return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
    }
// this method will goes wrong in 50% situation

// or you can create pipe factory to modify the pipe behavior by constructor params
export class TokenCheck extends MiddlewarePipe {

    constructor(private token: string) { super(); }

    process(): void | Promise<void> {
        const tk: string = this.context.request.headers.get("jwt-token");
        if (!tk || tk !== (this.token || "default_token")) {
            // this.throws("401 unauthorize");
            this.redirect(301, "/api/error401");
        }
    }

}

export const Authorize: IPipeFactory = createPipeBundle(TokenCheck);

// then call this factory with params
@Pipes([Authorize("user_role")]) // =>  this.token = "user_role"
```

#### 5. Form control
```JavaScript
// there are two ways to access the form data
    @Method("POST")
    @Route("post")
    @Middleware([], false)
    public POSTIndex(name:string, @FromBody() params: any): JsonResult {
        console.log("this is a post method");
        const form = this.context.form;
        console.log(form.data);
        console.log(params);
        return new JsonResult(params);
    }

    // then post message in application/json format : 
    // {"name":"bws", age:123}

    // console output:
    // {"name":"bws", age:123}
    // {"name":"bws", age:123}

    /*
    * All supported decorators :
    * @FromBody()   -   default : application/json
    * @FormData()   -   default : multiple/form-data
    * @FromForm()   -   default : application/x-www-form-urlencoded
    * @RawBody()   -   default : application/octet-stream
    * @TextBody()   -   default : text/plain
    */

   // static-typed form params will be introduced later.
```

#### 6.Multiple injections with POST/PUT
```JavaScript
// create a static-type model to describe form structure:
import { Serialize, Deserialize } from "bonbons";

// model to describe the form data structure
export class PostModel {

    // data contract
    @Serialize("received_ame")
    @Deserialize("NAME_TEST")
    private _name: string;
    public get Name() { return this._name; }

    // data contract and type convert
    @Serialize(Number, "receivedMax")
    @Deserialize(Number, "MAX_TEST")
    private _max: number;
    public get MAX() { return this._max; }

}

// then try to create a post method:
    @Method("POST")
    @Route("post/:id/details/:name", ["query", "find"])
    @Middleware([], false)
    public POSTIndex( // you can access params, queryParams and form object by function-params-injection.
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
         return this.toJSON({
            theParams: params,
            theName: name,
            theQuery: query,
            theId: id,
            theFind: find
        }, { resolver: JsonResultResolvers.decamalize }); 
        // use resolver to change object keys, this will work an the end of JSON.stringfy.
    }

/**
* then post to "localhost:3000/api/post/123456/details/miao18game?query=sss&find=mmm" with body : 
* {
*   "NAME_TEST":"miao17game",
*   "MAX_TEST":123
* }
*  
* output: 
* "this is a post method"
* "123456 - miao18game - sss - mmm"
* "numner - string - string - string"
* "PostModel { _name: 'miao17game', _max: 123 }"
* "PostModel"
*
* response : 
*   {
*       "the_params": {
*           "received_name": "miao17game", 
*           // key is resolved by @Deserialize/@Serialize
*           "received_max": 123  
*           // key is resolved by @Deserialize/@Serialize and JsonResultResolvers.decamalize
*       },
*       "the_name": "miao18game",
*       "the_query": "sss",
*       "the_id": 123456,
*       "the_find": "mmm"
*   }
*
* JsonResult will automatically transform static-type object to correct object-json with data contract, 
* or you can transfoem manually with [TypedSerializer.ToJSON(obj)], 
* if you create contract with decorators : @Serialize/@Deserialize.
* 
* Of cource, you can define your own static-typed serialization behavior, 
* only create your serializer implements the IStaticTypedResolver
*/
```

#### 7. Async method
```JavaScript
    @Method("GET")
    @Route("/index")
    public async GetIndex(): Async<string> {
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
        return this.sup.print();
    }

    // it works!
    // Async<T> = Promise<T>, only an alias.
```

#### 8. String encoding support
```JavaScript
    @Method("GET")
    @Route("/index")
    public async GetIndex(): StringResult {
        console.log("this is a get method with base : ");
        return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
        // defaults:
        // encoding: "utf8"
        // decoding: "utf8"
    }

    // response:
    // "woshinidie : 我是你爹"
```

**Still in developing...**

