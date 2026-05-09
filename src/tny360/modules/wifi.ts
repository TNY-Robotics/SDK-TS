import { StringType } from "../../core/DataTypes";
import { Module } from "./Module";

export class WiFiModule extends Module {
    public static readonly MODULE_ID = 0x10;

    constructor(protocol: any) {
        super(WiFiModule.MODULE_ID, protocol);
    }

    public async connectToAP(ssid: string, password: string, waitResponse = false) {
        return await this.sendAction(0x00, [new StringType(ssid), new StringType(password)], []);
    }
}
