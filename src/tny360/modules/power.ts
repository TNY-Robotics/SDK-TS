import { Float32 } from "../../core/DataTypes";
import { Module } from "./Module";

export class PowerModule extends Module {
    public static readonly MODULE_ID = 0x09;

    constructor(protocol: any) {
        super(PowerModule.MODULE_ID, protocol);
    }

    public async getVoltage() {
        return await this.sendAction(0x00, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getCurrent() {
        return await this.sendAction(0x01, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getPower() {
        return await this.sendAction(0x02, [], [new Float32()]).then(res => res?.[0] as number);
    }
}
