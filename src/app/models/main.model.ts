import { Serialization, Deserialization } from "./../../framework";

export class PostModel {

    @Serialization("name")
    @Deserialization("name")
    private _name: string;
    public get Name() { return this._name; }

    @Serialization(Number, "max")
    @Deserialization(Number, "max")
    private _max: number;
    public get MAX() { return this._max; }

}