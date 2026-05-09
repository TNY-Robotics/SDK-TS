import { Float32, StringType, UInt8, UInt32 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum AutoLifeFlags {
    None = 0, // No auto life features enabled
    Safeguard = 1 << 0, // Use safeguards (avoid fall, self-righting, wall collision, etc.)
    AutoGait = 1 << 1, // Automatically choose gait based on conditions (velocity, terrain, etc.)
    AutoPosture = 1 << 2, // Automatically adjust body posture based on conditions (velocity, terrain, etc.)
    Animate = 1 << 3, // Enable animations (idle, walk, run, etc.)
    Wandering = 1 << 4, // Enable wandering behavior when no command is given
}

export enum AutoLifeLevel {
    Off = AutoLifeFlags.None,
    Safeguard = AutoLifeFlags.Safeguard,
    Animate = AutoLifeFlags.Safeguard | AutoLifeFlags.AutoGait | AutoLifeFlags.AutoPosture | AutoLifeFlags.Animate,
    Full = AutoLifeFlags.Safeguard | AutoLifeFlags.AutoGait | AutoLifeFlags.AutoPosture | AutoLifeFlags.Animate | AutoLifeFlags.Wandering,
}

export class SystemModule extends Module {
    public static readonly MODULE_ID = 0x00;

    constructor(protocol: any) {
        super(SystemModule.MODULE_ID, protocol);
    }

    public async ping() {
        return await this.sendAction(0x00, [], [], Flag.RequireAck);
    }

    public async reboot() {
        return await this.sendAction(0x01, [], []);
    }

    public async setSettings(json: string, waitResponse = false) {
        return await this.sendAction(0x02, [new StringType(json)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getSettings() {
        return await this.sendAction(0x03, [], [new StringType()]).then(res => res?.[0] as string);
    }

    public async setAutoLifeLevel(level: AutoLifeLevel, waitResponse = false) {
        return await this.sendAction(0x04, [new UInt8(level)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }

    public async getAutoLifeLevel() {
        return await this.sendAction(0x05, [], [new UInt8()]).then(res => res?.[0] as AutoLifeLevel);
    }

    public async getStatistics() {
        return await this.sendAction(0x06, [], [new Float32(), new Float32(), new Float32(), new UInt32(), new UInt32(), new UInt32(), new UInt32()]).then(res => ({
            temp_c: res?.[0] as number,
            cpu_usage: {
                core0: res?.[1] as number,
                core1: res?.[2] as number,
            },
            ram_usage: {
                internal_total: res?.[3] as number,
                internal_used: res?.[4] as number,
                psram_total: res?.[5] as number,
                psram_used: res?.[6] as number,
            }
        }));
    }
}
