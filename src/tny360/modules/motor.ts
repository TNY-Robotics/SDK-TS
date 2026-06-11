import { Bool, Float32, UInt8 } from "../../core/DataTypes";
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

export type MotorCalibrationData = {
    /** Minimum Duty Cycle value corresponding to the minimum physical position of the motor */
    dc_min: number;
    /** Maximum Duty Cycle value corresponding to the maximum physical position of the motor */
    dc_max: number;
    /** Deadband width in Duty Cycle unit */
    dc_deadband: number;
    /** Feedback value corresponding to the minimum physical position of the motor */
    feedback_min: number;
    /** Feedback value corresponding to the maximum physical position of the motor */
    feedback_max: number;
    /** Feedback noise level in Volt (standard deviation) */
    feedback_noise: number;
    /** Latency between command and movement in ms */
    feedback_latency_ms: number;
    /** Flag indicating whether the feedback is inverted (low voltage for max position, high voltage for min position) */
    feedback_inverted: boolean;
    /** Maximum speed of the motor (in progress per second, where progress is the distance between min and max bound) */
    max_speed: number;
}

export class MotorModule extends Module {
    public static readonly MODULE_ID = 0x06;

    constructor(protocol: any) {
        super(MotorModule.MODULE_ID, protocol);
    }

    public async setDutyCycle(id: MotorId, duty_ms: number, waitResponse = false) {
        return await this.sendAction(0x00, [new UInt8(id), new Float32(duty_ms)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getDutyCycle(id: MotorId) {
        return await this.sendAction(0x01, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }

    public async getCalibrationState(id: MotorId) {
        return await this.sendAction(0x02, [new UInt8(id)], [new UInt8()]).then(res => res?.[0] as MotorCalibrationState);
    }

    public async getCalibrationData(id: MotorId) {
        return this.sendAction(0x03, [new UInt8(id)], [new Float32(), new Float32(), new Float32(), new Float32(), new Float32(), new Float32(), new Float32(), new Bool(), new Float32()]).then(res => ({
            dc_min: res?.[0] as number,
            dc_max: res?.[1] as number,
            dc_deadband: res?.[2] as number,
            feedback_min: res?.[3] as number,
            feedback_max: res?.[4] as number,
            feedback_noise: res?.[5] as number,
            feedback_latency_ms: res?.[6] as number,
            feedback_inverted: res?.[7] as boolean,
            max_speed: res?.[8] as number,
        } as MotorCalibrationData));
    }

    public async setCalibrationData(id: MotorId, data: MotorCalibrationData, waitResponse = false) {
        return await this.sendAction(0x04, [new UInt8(id),
            new Float32(data.dc_min), new Float32(data.dc_max), new Float32(data.dc_deadband),
            new Float32(data.feedback_min), new Float32(data.feedback_max), new Float32(data.feedback_noise),
            new Float32(data.feedback_latency_ms), new Bool(data.feedback_inverted), new Float32(data.max_speed)
        ], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async deleteCalibrationData(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x05, [new UInt8(id)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async startCalibration(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x06, [new UInt8(id)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async stopCalibration(id: MotorId, waitResponse = false) {
        return await this.sendAction(0x07, [new UInt8(id)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getCalibrationProgress(id: MotorId) {
        return await this.sendAction(0x08, [new UInt8(id)], [new Float32()]).then(res => res?.[0] as number);
    }
}
