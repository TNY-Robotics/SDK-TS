import { UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum GaitType {
    Creep = 0,
    Walk = 1,
    Run = 2,
    Jump = 3,
}

export class GaitModule extends Module {
    public static readonly MODULE_ID = 0x02;

    constructor(protocol: any) {
        super(GaitModule.MODULE_ID, protocol);
    }

    public async setType(type: GaitType, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt8(type)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getType() {
        return await this.sendAction(0x01, [], [new UInt8()]).then(res => res?.[0] as GaitType);
    }
}
