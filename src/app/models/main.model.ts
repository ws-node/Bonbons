import { Serialize, Deserialize } from "./../../framework";

export class PostModel {

    @Serialize("received_name")
    @Deserialize("NAME_TEST")
    private _name: string;
    public get Name() { return this._name; }

    @Serialize(Number, "receivedMax")
    @Deserialize(Number, "MAX_TEST")
    private _max: number;
    public get MAX() { return this._max; }

}