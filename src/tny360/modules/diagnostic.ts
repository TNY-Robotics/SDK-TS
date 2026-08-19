import { Bool, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export class DiagnosticModule extends Module {
    public static readonly MODULE_ID = 0x14;

    constructor(protocol: any) {
        super(DiagnosticModule.MODULE_ID, protocol);
    }

    public async isEnabled() {
        return await this.sendAction(0x00, [], [new Bool()]).then(res => res?.[0] as boolean);
    }

    public async rebootInDiagnosticMode() {
        return await this.sendAction(0x01, [], [], Flag.None);
    }

    public async checkLED() {
        return await this.sendAction(0x02, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkI2C() {
        return await this.sendAction(0x03, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkSpeaker() {
        return await this.sendAction(0x04, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkMicrophone() {
        return await this.sendAction(0x05, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkCamera() {
        return await this.sendAction(0x06, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkLaser() {
        return await this.sendAction(0x07, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkIMU() {
        return await this.sendAction(0x08, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkPower() {
        return await this.sendAction(0x09, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkMotorDriver() {
        return await this.sendAction(0x0A, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkAnalogReader() {
        return await this.sendAction(0x0B, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkControlLoop() {
        return await this.sendAction(0x0C, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async checkDecisionLoop() {
        return await this.sendAction(0x0D, [], [new UInt8()]).then(res => res?.[0] as number);
    }
}
