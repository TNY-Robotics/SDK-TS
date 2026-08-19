import { Float32, UInt8 } from "../../core/DataTypes";
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

    public async setFrequency(freq_hz: number, waitResponse = false) {
        return await this.sendAction(0x02, [new Float32(freq_hz)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getFrequency() {
        return await this.sendAction(0x03, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async setDutyFactor(factor: number, waitResponse = false) {
        return await this.sendAction(0x04, [new Float32(factor)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getDutyFactor() {
        return await this.sendAction(0x05, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async setStepHeight(height_m: number, waitResponse = false) {
        return await this.sendAction(0x06, [new Float32(height_m)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getStepHeight() {
        return await this.sendAction(0x07, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async setStanceDepth(depth_m: number, waitResponse = false) {
        return await this.sendAction(0x08, [new Float32(depth_m)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getStanceDepth() {
        return await this.sendAction(0x09, [], [new Float32()]).then(res => res?.[0] as number);
    }

    public async setLegSpread(spread_m: {x: number, y: number}, waitResponse = false) {
        return await this.sendAction(0x0A, [new Float32(spread_m.x), new Float32(spread_m.y)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getLegSpread() {
        return await this.sendAction(0x0B, [], [new Float32(), new Float32()]).then(res => ({x: res?.[0] as number, y: res?.[1] as number}) );
    }
}
