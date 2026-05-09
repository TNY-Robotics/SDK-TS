import { Float32, UInt16 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export class ProtocolModule extends Module {
    public static readonly MODULE_ID = 0x01;

    constructor(protocol: any) {
        super(ProtocolModule.MODULE_ID, protocol);
    }

    public async setStreamFrequency(frequency: number, waitResponse = false) {
        return await this.sendAction(0x00, [new Float32(frequency)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async setStreamFlags(flags: Flag, waitResponse = false) {
        return await this.sendAction(0x01, [new UInt16(flags)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
}
