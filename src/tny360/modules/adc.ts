import { Float32 } from "../../core/DataTypes";
import { Module } from "./Module";

export class ADCModule extends Module {
    public static readonly MODULE_ID = 0x0F;

    constructor(protocol: any) {
        super(ADCModule.MODULE_ID, protocol);
    }

    public async getAllChannels() {
        return await this.sendAction(0x00, [], Array.from({ length: 16 }, () => new Float32())).then(res => res as number[]);
    }
}
