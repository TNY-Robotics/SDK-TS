import { Bool, Float32, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum IMUCalibrationState {
    Uncalibrated = 0,
    Calibrating = 1,
    Calibrated = 2,
    Error = 3
}

export class IMUModule extends Module {
    public static readonly MODULE_ID = 0x07;

    constructor(protocol: any) {
        super(IMUModule.MODULE_ID, protocol);
    }

    public async getAcceleration() {
        return await this.sendAction(0x00, [], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x_g: res?.[0] as number,
            y_g: res?.[1] as number,
            z_g: res?.[2] as number,
        }));
    }

    public async getAngularVelocity() {
        return await this.sendAction(0x01, [], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x_rads: res?.[0] as number,
            y_rads: res?.[1] as number,
            z_rads: res?.[2] as number,
        }));
    }

    public async getDownVector() {
        return await this.sendAction(0x02, [], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x: res?.[0] as number,
            y: res?.[1] as number,
            z: res?.[2] as number,
        }));
    }

    public async getOrientation() {
        return await this.sendAction(0x03, [], [new Float32(), new Float32(), new Float32()]).then(res => ({
            x_rad: res?.[0] as number,
            y_rad: res?.[1] as number,
            z_rad: res?.[2] as number,
        }));
    }

    public async getCalibrationState() {
        return await this.sendAction(0x04, [], [new UInt8()]).then(res => res?.[0] as IMUCalibrationState);
    }

    public async getCalibrationData() {
        throw new Error("Not implemented");
    }

    public async setCalibrationData() {
        throw new Error("Not implemented");
    }

    public async startCalibration(waitResponse = false) {
        return await this.sendAction(0x07, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async stopCalibration(waitResponse = false) {
        return await this.sendAction(0x08, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getCalibrationProgress() {
        return await this.sendAction(0x09, [], [new Float32()]).then(res => res?.[0] as number);
    }
}
