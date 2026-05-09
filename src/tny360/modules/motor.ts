import { Float32, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum MotorId {
    FrontLeftHipRoll = 0,
    FrontLeftHipPitch = 1,
    FrontLeftKneePitch = 2,
    BackLeftHipRoll = 3,
    BackLeftHipPitch = 4,
    BackLeftKneePitch = 5,
    BackRightHipRoll = 6,
    BackRightHipPitch = 7,
    BackRightKneePitch = 8,
    FrontRightHipRoll = 9,
    FrontRightHipPitch = 10,
    FrontRightKneePitch = 11,
    EarLeft = 12,
    EarRight = 13,
}

export enum MotorCalibrationState {
    Uncalibrated = 0,
    Calibrating = 1,
    Calibrated = 2,
    Error = 3
}

export class MotorModule extends Module {
    public static readonly MODULE_ID = 0x06;

    constructor(protocol: any) {
        super(MotorModule.MODULE_ID, protocol);
    }

    public async setPWMDutyCycle(id: MotorId, duty_ms: number, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt8(id), new Float32(duty_ms)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getPWMDutyCycle(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x01, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getCalibrationState(id: MotorId) {
        return await this.sendAction(0x02, [new UInt8(id)], [new UInt8()]).then(res => res?.[0] as MotorCalibrationState);
    }

    public async getCalibrationData(id: MotorId) {
        throw new Error("Not implemented");
    }

    public async setCalibrationData(id: MotorId) {
        throw new Error("Not implemented");
    }

    public async startCalibration(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x05, [new UInt8(id)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async stopCalibration(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x06, [new UInt8(id)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getCalibrationProgress(id: MotorId) {
        return await this.sendAction(0x07, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }
}
