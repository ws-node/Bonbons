import uuid from "uuid/v4";

export class UUIDConstructor {
    public Create(): string {
        return uuid();
    }
}

export const UUID = new UUIDConstructor();
