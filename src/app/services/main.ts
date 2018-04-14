import { Injectabe } from "../../framework/injectable";

export abstract class ABCService { }

@Injectabe()
export class SecService {

    constructor() {

    }

}

@Injectabe()
export class MainService extends ABCService {

    constructor(sec: SecService) {
        super();
    }

}

@Injectabe()
export class SuperService {

    constructor(sec: SecService, main: ABCService) {

    }

    print() {
        return "Hello World!";
    }

}