import { Float32, UInt16 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { JointId } from "./joint";
import { Module } from "./Module";

export enum BodyJointFlag {
    FrontLeftHipRoll = 1 << JointId.FrontLeftHipRoll,
    FrontLeftHipPitch = 1 << JointId.FrontLeftHipPitch,
    FrontLeftKneePitch = 1 << JointId.FrontLeftKneePitch,
    BackLeftHipRoll = 1 << JointId.BackLeftHipRoll,
    BackLeftHipPitch = 1 << JointId.BackLeftHipPitch,
    BackLeftKneePitch = 1 << JointId.BackLeftKneePitch,
    BackRightHipRoll = 1 << JointId.BackRightHipRoll,
    BackRightHipPitch = 1 << JointId.BackRightHipPitch,
    BackRightKneePitch = 1 << JointId.BackRightKneePitch,
    FrontRightHipRoll = 1 << JointId.FrontRightHipRoll,
    FrontRightHipPitch = 1 << JointId.FrontRightHipPitch,
    FrontRightKneePitch = 1 << JointId.FrontRightKneePitch,
    EarLeft = 1 << JointId.EarLeft,
    EarRight = 1 << JointId.EarRight,
}

export class BodyModule extends Module {
    public static readonly MODULE_ID = 0x03;

    constructor(protocol: any) {
        super(BodyModule.MODULE_ID, protocol);
    }

    public async setEnabled(jointFlag: BodyJointFlag, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt16(jointFlag)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getEnabled() {
        return await this.sendAction(0x01, [], [new UInt16()]).then(res => res?.[0] as BodyJointFlag);
    }

    public async setVelocity(x_ms: number, y_ms: number, z_rads: number, waitResponse = false) {
        return await this.sendAction(0x02, [new Float32(x_ms), new Float32(y_ms), new Float32(z_rads)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getTargetVelocity() {
        return await this.sendAction(0x03, [], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x_ms: res?.[0] as number,
            y_ms: res?.[1] as number,
            z_rads: res?.[2] as number
        }));
    }

    public async setPosture(pos_x_m: number, pos_y_m: number, pos_z_m: number, rot_x_rad: number, rot_y_rad: number, rot_z_rad: number, waitResponse = false) {
        return await this.sendAction(0x04, [
            new Float32(pos_x_m), new Float32(pos_y_m), new Float32(pos_z_m),
            new Float32(rot_x_rad), new Float32(rot_y_rad), new Float32(rot_z_rad)
        ], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getPosture() {
        return await this.sendAction(0x05, [], [new Float32(), new Float32(), new Float32(), new Float32(), new Float32(), new Float32()]).then(res => ({
            pos_x_m: res?.[0] as number,
            pos_y_m: res?.[1] as number,
            pos_z_m: res?.[2] as number,
            rot_x_rad: res?.[3] as number,
            rot_y_rad: res?.[4] as number,
            rot_z_rad: res?.[5] as number
        }));
    }
}
