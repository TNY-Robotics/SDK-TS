import { ByteArray, UInt16, UInt32, UInt8 } from "../../core/DataTypes";
import { Flag } from "../../core/Protocol";
import { Module } from "./Module";

export enum ErrorSeverity {
    /** @brief Low level problems (debug infos that would be useful in case of problems) */
    Trace = 0x01,
    /** @brief When non-critical issues occur that may cause further problems */
    Warning = 0x02,
    /** @brief When important issues occur that will degrade normal operation */
    Error = 0x03,
    /** @brief When critical issues occur, and the system should stop to prevent further damage */
    Critical = 0x04,
}

export type ErrorEvent = {
    /** @brief The timestamp of the error event in milliseconds since system start. */
    timestampMs: number;
    /** @brief The unique event ID assigned to this error event. */
    eventId: number;
    /** @brief The full error code (includes module, subsystem, error code, and severity). */
    fullCode: number;
    /** @brief The module ID where the error occurred (see ModuleID). */
    module: number;
    /** @brief The subsystem ID within the module where the error occurred. */
    subsystem: number;
    /** @brief The specific error code within the subsystem. */
    code: number;
    /** @brief The severity level of the error (see ErrorSeverity). */
    severity: ErrorSeverity;
    /** @brief The size of the payload data in bytes. */
    payloadSize: number;
    /** @brief The payload data associated with the error event (up to 32 bytes). */
    payload: Uint8Array;
}
const ErrorEventDataTypes = [
    new UInt32(), // timestampMs
    new UInt16(), // eventId
    new UInt8(), // module
    new UInt8(), // subsystem
    new UInt8(), // code
    new UInt8(), // severity
    new UInt8(), // payloadSize
    new ByteArray() // payload
];
const parseErrorEvent = (data: any[]): ErrorEvent|null => {
    const event = {
        timestampMs: data[0] as number,
        eventId: data[1] as number,
        fullCode: (data[2] as number) << 24 | (data[3] as number) << 16 | (data[4] as number) << 8 | (data[5] as number),
        module: data[2] as number,
        subsystem: data[3] as number,
        code: data[4] as number,
        severity: data[5] as ErrorSeverity,
        payloadSize: data[6] as number,
        payload: data[7] as Uint8Array
    } as ErrorEvent;
    if (event.eventId === 0) return null; // empty event
    return event;
};

export class ErrorModule extends Module {
    public static readonly MODULE_ID = 0x13;

    constructor(protocol: any) {
        super(ErrorModule.MODULE_ID, protocol);
    }

    public async getErrorCount() {
        return await this.sendAction(0x00, [], [new UInt16()]).then(res => res?.[0] as number);
    }

    public async getErrorEventByIndex(index: number) {
        return await this.sendAction(0x01, [new UInt16(index)], ErrorEventDataTypes).then(res => res? parseErrorEvent(res): null);
    }

    public async getErrorEventById(id: number) {
        return await this.sendAction(0x02, [new UInt16(id)], ErrorEventDataTypes).then(res => res? parseErrorEvent(res): null);
    }

    public async clearErrorEvents(waitResponse: boolean = true) {
        return await this.sendAction(0x03, [], [], waitResponse ? Flag.RequireAck : Flag.None);
    }
}
