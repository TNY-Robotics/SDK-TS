import { Float32, StringType, UInt8, UInt32, Bool } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum AutoLifeFlags {
    /** No auto life features enabled */
    None = 0,
    /** Use safeguards (avoid fall, self-righting, wall collision, etc.) */
    Safeguard = 1 << 0,
    /** Automatically choose gait based on conditions (velocity, terrain, etc.) */
    AutoGait = 1 << 1,
    /** Automatically adjust body posture based on conditions (velocity, terrain, etc.) */
    AutoPosture = 1 << 2,
    /** Enable animations (idle, walk, run, etc.) */
    Animate = 1 << 3,
    /** Enable wandering behavior when no command is given */
    Wandering = 1 << 4,
}

export enum AutoLifeLevel {
    /** All auto life features disabled */
    Off = AutoLifeFlags.None,
    /** Only safeguards enabled */
    Safeguard = AutoLifeFlags.Safeguard,
    /** Safeguards + auto gait + auto posture + animations enabled */
    Animate = AutoLifeFlags.Safeguard | AutoLifeFlags.AutoGait | AutoLifeFlags.AutoPosture | AutoLifeFlags.Animate,
    /** All auto life features enabled */
    Full = AutoLifeFlags.Safeguard | AutoLifeFlags.AutoGait | AutoLifeFlags.AutoPosture | AutoLifeFlags.Animate | AutoLifeFlags.Wandering,
}

export enum LogLevel {
    /** Info level log */
    Info,
    /** Warning level log */
    Warning,
    /** Error level log */
    Error,
    /** Debug level log */
    Debug,
    /** Success level log */
    Success
}

export type LogLine = {
    /** Timestamp in milliseconds since boot */
    timestamp_ms: number;
    /** Log level (see LogLevel enum) */
    level: LogLevel;
    /** Indentation level for hierarchical logs */
    indent: number;
    /** Log tag/category */
    tag: string;
    /** Log message content */
    message: string;
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

    public async getNbLogLines() {
        return await this.sendAction(0x07, [], [new UInt8()]).then(res => res?.[0] as number);
    }

    public async getLogLine(index: number) {
        return await this.sendAction(0x08, [new UInt8(index)], [new UInt32(), new UInt8(), new UInt8(), new StringType(), new StringType()]).then(res => ({
            timestamp_ms: res?.[0] as number,
            level: res?.[1] as LogLevel,
            indent: res?.[2] as number,
            tag: res?.[3] as string,
            message: res?.[4] as string,
        } as LogLine));
    }

    public async setControlLoopEnabled(enabled: boolean) {
        return await this.sendAction(0x09, [new Bool(enabled)], []);
    }

    public async getControlLoopEnabled() {
        return await this.sendAction(0x0A, [], [new Bool()]).then(res => res?.[0] as boolean);
    }

    public async setDecisionLoopEnabled(enabled: boolean) {
        return await this.sendAction(0x0B, [new Bool(enabled)], []);
    }

    public async getDecisionLoopEnabled() {
        return await this.sendAction(0x0C, [], [new Bool()]).then(res => res?.[0] as boolean);
    }
}
