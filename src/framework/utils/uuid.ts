import uuid from "uuid/v4";

export class UUID {
    public static Create(): string {
        return uuid();
    }
}