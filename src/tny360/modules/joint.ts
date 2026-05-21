import { Bool, Float32, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";
import { MotorId } from "./motor";

export enum JointId {
    FrontLeftHipRoll = MotorId.FrontLeftHipRoll,
    FrontLeftHipPitch = MotorId.FrontLeftHipPitch,
    FrontLeftKneePitch = MotorId.FrontLeftKneePitch,
    BackLeftHipRoll = MotorId.BackLeftHipRoll,
    BackLeftHipPitch = MotorId.BackLeftHipPitch,
    BackLeftKneePitch = MotorId.BackLeftKneePitch,
    BackRightHipRoll = MotorId.BackRightHipRoll,
    BackRightHipPitch = MotorId.BackRightHipPitch,
    BackRightKneePitch = MotorId.BackRightKneePitch,
    FrontRightHipRoll = MotorId.FrontRightHipRoll,
    FrontRightHipPitch = MotorId.FrontRightHipPitch,
    FrontRightKneePitch = MotorId.FrontRightKneePitch,
    EarLeft = MotorId.EarLeft,
    EarRight = MotorId.EarRight,
}

export class JointModule extends Module {
    public static readonly MODULE_ID = 0x05;

    constructor(protocol: any) {
        super(JointModule.MODULE_ID, protocol);
    }

    public async setEnabled(id: JointId, enabled: boolean, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt8(id), new Bool(enabled)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getEnabled(id: JointId) {
        return await this.sendAction(0x01, [new UInt8(id)], [new Bool()]).then(res => res?.[0] as boolean);
    }

    public async setAngle(id: JointId, angle: number, waitResponse = false) {
        return await this.sendAction(0x02, [new UInt8(id), new Float32(angle)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getTargetAngle(id: JointId) {
        return await this.sendAction(0x03, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getFeedbackAngle(id: JointId) {
        return await this.sendAction(0x04, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getModelAngle(id: JointId) {
        return await this.sendAction(0x05, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getEstimatedAngle(id: JointId) {
        return await this.sendAction(0x06, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async setJointAngles(angles: number[], waitResponse = false) {
        if (angles.length !== 14) {
            throw new Error("Invalid angles array length. Expected 14.");
        }
        const data = angles.map((angle, index) => new Float32(angle));
        return await this.sendAction(0x07, data, [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getJointAngles() {
        const data = Array.from({ length: 14 }, () => new Float32());
        return await this.sendAction(0x08, [], data).then(res => res as number[]);
    }
}
