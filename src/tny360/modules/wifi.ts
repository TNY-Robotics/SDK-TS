import { Bool, StringType, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

/** Current state of the WiFiManager. */
export enum WiFiState {
    /** The WiFiManager is initializing. Will transition to Initialized or Error state after initialization. */
    Initializing,
    /** The WiFiManager is ready to be used, no STA or AP configured. */
    Initialized,
    /** The WiFiManager is in an error state. */
    Error,
    /** The WiFiManager is attempting to connect to an AP. Will transition to Connected or ConnectFailed state after attempting to connect. */
    Connecting,
    /** The WiFiManager is connected to an AP. */
    Connected,
    /** The WiFiManager failed to connect to an AP. */
    ConnectFailed,
    /** The WiFiManager is disconnecting from an AP. Will transition to Initialized state after disconnecting. */
    Disconnecting,
    /** The WiFiManager is starting an AP. Will transition to Started or StartFailed state after attempting to start. */
    Starting,
    /** The WiFiManager has started an AP. */
    Started,
    /** The WiFiManager failed to start an AP. */
    StartFailed,
    /** The WiFiManager is stopping an AP. Will transition to Initialized state after stopping. */
    Stopping,
}

/** Current mode of the WiFiManager, deduced from the current state. */
export enum WiFiMode {
    /** The WiFiManager is in Station mode. connecting, connected, or disconnecting from an AP (or in failure state). */
    STA,
    /** The WiFiManager is in Access Point mode. Starting, started, or stopping his AP (or in failure state). */
    AP,
    /** The WiFiManager is in an unknown mode, in case of error or uninitialized state. */
    None
}

export class WiFiModule extends Module {
    public static readonly MODULE_ID = 0x10;

    constructor(protocol: any) {
        super(WiFiModule.MODULE_ID, protocol);
    }

    public async connectToAP(ssid: string, password: string, waitResponse = false) {
        return await this.sendAction(0x00, [new StringType(ssid), new StringType(password)], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
    public async disconnectFromAP(waitResponse = false) {
        return await this.sendAction(0x01, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
    public async hasStoredAPCredentials() {
        return await this.sendAction(0x02, [], [new Bool()]).then(res => res?.[0] as boolean);
    }
    public async forgetStoredAPCredentials(waitResponse = false) {
        return await this.sendAction(0x03, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
    public async startAP(waitResponse = false) {
        return await this.sendAction(0x04, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
    public async stopAP(waitResponse = false) {
        return await this.sendAction(0x05, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
    public async getState() {
        return await this.sendAction(0x06, [], [new UInt8()]).then(res => res?.[0] as WiFiState);
    }
    public async getMode() {
        return await this.sendAction(0x07, [], [new UInt8()]).then(res => res?.[0] as WiFiMode);
    }
    public async getSSID() {
        return await this.sendAction(0x08, [], [new StringType()]).then(res => res?.[0] as string);
    }
    public async getIPAddr() {
        return await this.sendAction(0x09, [], [new StringType()]).then(res => res?.[0] as string);
    }
    public async getMACAddr() {
        return await this.sendAction(0x0A, [], [new StringType()]).then(res => res?.[0] as string);
    }
}
