import { UUID } from "../../framework/utils/uuid";
import { Injectabe } from "./../../framework";

export abstract class ABCService {
    public abstract getMessage(): string;
}

@Injectabe()
export class SecService {

    private id = UUID.Create();

    constructor() {

    }

}

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

@Injectabe()
export class SuperService {

    private id = UUID.Create();

    constructor(private sec: SecService, private main: ABCService) {

    }

    print() {
        return "Hello World! " + this.main.getMessage();
    }

}