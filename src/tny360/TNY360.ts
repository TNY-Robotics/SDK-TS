import { Protocol } from "../core/Protocol";

import { SystemModule, AutoLifeFlags, AutoLifeLevel, LogLevel, LogLine } from "./modules/system";
import { ProtocolModule } from "./modules/protocol";
import { GaitModule, GaitType } from "./modules/gait";
import { BodyModule, BodyJointFlag } from "./modules/body";
import { LegModule, LegId, LegJointFlag } from "./modules/leg";
import { JointModule, JointId } from "./modules/joint";
import { MotorModule, MotorCalibrationState, MotorCalibrationData, MotorId } from "./modules/motor";
import { IMUModule, IMUCalibrationState } from "./modules/imu";
import { WiFiModule } from "./modules/wifi";
import { PowerModule } from "./modules/power";
import { ADCModule } from "./modules/adc";
import { I2CModule } from "./modules/i2c";

export {
    AutoLifeFlags,
    AutoLifeLevel,
    GaitType,
    BodyJointFlag,
    LegId,
    LegJointFlag,
    JointId,
    MotorCalibrationState,
    MotorCalibrationData,
    MotorId,
    IMUCalibrationState,
    LogLevel,
    LogLine,
}

export class TNY360 {
    private _protocol: Protocol;
    private _latency: number = 0;
    private _latency_loop?: NodeJS.Timeout;
    
    public system: SystemModule;
    public protocol: ProtocolModule;
    public gait: GaitModule;
    public body: BodyModule;
    public leg: LegModule;
    public joint: JointModule;
    public motor: MotorModule;
    public imu: IMUModule;
    public power: PowerModule;
    public adc: ADCModule;
    public i2c: I2CModule;
    public wifi: WiFiModule;

    constructor(ip: string = '192.168.4.1', port: number = 5621) {
        this._protocol = new Protocol(ip, port);

        this.system = new SystemModule(this._protocol);
        this.protocol = new ProtocolModule(this._protocol);
        this.gait = new GaitModule(this._protocol);
        this.body = new BodyModule(this._protocol);
        this.leg = new LegModule(this._protocol);
        this.joint = new JointModule(this._protocol);
        this.motor = new MotorModule(this._protocol);
        this.imu = new IMUModule(this._protocol);
        this.power = new PowerModule(this._protocol);
        this.adc = new ADCModule(this._protocol);
        this.i2c = new I2CModule(this._protocol);
        this.wifi = new WiFiModule(this._protocol);
    }

    public async connect() {
        await this._protocol.connect();
        this._latency_loop = setInterval(async () => {
            const start = Date.now();
            try { await this.system.ping(); } catch (e) {}
            const end = Date.now();
            const latency = end - start;
            if (this._latency === 0) this._latency = latency;
            else this._latency = this._latency * 0.8 + (latency) * 0.2;
        }, 2000);
    }

    public async disconnect() {
        if (this._latency_loop) {
            clearInterval(this._latency_loop);
        }
        await this._protocol.disconnect();
    }
    
    public get connected() {
        return this._protocol.connected;
    }

    public get latency() {
        return this._latency;
    }
}