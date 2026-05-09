import { Bool, Float32, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum LegJointFlag {
    HipRoll = 1 << 0,
    HipPitch = 1 << 1,
    KneePitch = 1 << 2,
}

export enum LegId {
    FrontLeft = 0,
    BackLeft = 1,
    BackRight = 2,
    FrontRight = 3,
}

export class LegModule extends Module {
    public static readonly MODULE_ID = 0x04;

    constructor(protocol: any) {
        super(LegModule.MODULE_ID, protocol);
    }
    
    public async setEnabled(legId: LegId, jointFlag: LegJointFlag, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt8(legId), new UInt8(jointFlag)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getEnabled(legId: LegId) {
        return await this.sendAction(0x01, [new UInt8(legId)], [new UInt8()]).then(res => res?.[0] as LegJointFlag);
    }

    public async setPosition(id: LegId, x_m: number, y_m: number, z_m: number, waitResponse = false) {
        return await this.sendAction(0x02, [new UInt8(id), new Float32(x_m), new Float32(y_m), new Float32(z_m)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getTargetPosition(id: LegId) {
        return await this.sendAction(0x03, [new UInt8(id)], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x_m: res?.[0] as number,
            y_m: res?.[1] as number,
            z_m: res?.[2] as number,
        }));
    }

    public async getGrounded(id: LegId) {
        return await this.sendAction(0x04, [new UInt8(id)], [new Bool()]).then(res => res?.[0] as boolean);
    }
}
