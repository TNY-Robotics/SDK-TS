import WebSocket from 'isomorphic-ws';
import { DataWriter } from './DataWriter';
import { UInt8, UInt16 } from './DataTypes';
import { DataReader } from './DataReader';

export enum Flag {
    None = 0,
    RequireAck = 1 << 0,
}

export enum Type {
    Request = 1,
    Response = 2,
    Event = 3,
}

export enum Status {
    Ok = 0,
    UnknownModule = 1,
    UnknownAction = 2,
    InvalidParameters = 3,
}
export const StatusStr = [
    'Ok',
    'UnknownModule',
    'UnknownAction',
    'InvalidParameters',
];

class PendingRequest {
    private resolveCb: (data?: Uint8Array) => void;
    private rejectCb: (err: Error) => void;
    private timeoutId?: NodeJS.Timeout;

    constructor(resolve: (data?: Uint8Array) => void, reject: (err: Error) => void) {
        this.resolveCb = resolve;
        this.rejectCb = reject;

        this.timeoutId = setTimeout(() => {
            this.reject(new Error('Request timed out'));
        }, 2000);
    }

    resolve(data?: Uint8Array) {
        this.resolveCb(data);
        if (this.timeoutId) { clearTimeout(this.timeoutId); }
    }

    reject(err: Error) {
        this.rejectCb(err);
        if (this.timeoutId) { clearTimeout(this.timeoutId); }
    }
}

export class RequestError extends Error {
    constructor(public status: Status) {
        super('Request Error : ' + StatusStr[status as number]);
    }
}

export class Protocol {
    private ws?: WebSocket;
    private ip: string;
    private port: number;

    private msg_id_counter: number = 0;

    private pendingRequests: Map<number, PendingRequest> = new Map();

    private generateMsgId(): number {
        if (this.msg_id_counter++ >= 0xFFFF) {
            this.msg_id_counter = 0;
        }
        return this.msg_id_counter;
    }

    private generateMessageHeader(moduleId: number, actionId: number, flags: Flag, msgId: number, length: number): Uint8Array {
        return new DataWriter()
            .write(new UInt8(Type.Request))
            .write(new UInt8(flags))
            .write(new UInt16(msgId))
            .write(new UInt8(moduleId))
            .write(new UInt8(actionId))
            .write(new UInt16(length))
            .toBytes();
    }

    private parseMessageHeader(bytes: Uint8Array) {
        if (bytes.length < 8) {
            throw new Error('Invalid message header');
        }
        const parserRequest = new DataReader(bytes);
        const parserResponse = new DataReader(bytes);
        
        // skip parserResponse start data
        parserResponse.read(new UInt16()); parserResponse.read(new UInt16());

        return {
            // request header props
            type: parserRequest.read(new UInt8()).value as Type,
            flags: parserRequest.read(new UInt8()).value as Flag,
            msgId: parserRequest.read(new UInt16()).value,
            moduleId: parserRequest.read(new UInt8()).value,
            actionId: parserRequest.read(new UInt8()).value,
            length: parserRequest.read(new UInt16()).value,

            // Response header props
            status: parserResponse.read(new UInt16()).value as Status
        };
    }

    private onMessage(data: WebSocket.Data) {
        const bytes = new Uint8Array(data as ArrayBuffer);
        if (bytes.length < 8) {
            console.warn('Received invalid message');
            return;
        }

        const header = this.parseMessageHeader(bytes);
        if (header.type === Type.Response) {
            const pending = this.pendingRequests.get(header.msgId);
            if (pending) {
                if (header.status === Status.Ok) {
                    pending.resolve(bytes.slice(8, 8 + header.length));
                }
                else {
                    pending.reject(new RequestError(header.status));
                }
                this.pendingRequests.delete(header.msgId);
            }
            else {
                console.warn(`Received response for unknown msgId ${header.msgId}`);
            }
        }
        else {
            console.warn(`Message type ${header.type} not yet supported`);
        }
    }

    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
    }

    public async connect() {
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(`ws://${this.ip}:${this.port}`);
            this.ws.onmessage = (event) => { this.onMessage(event.data); };
            this.ws.onopen = () => { resolve(); };
            this.ws.onerror = (err) => { reject(err); };
        });
    }

    public async disconnect() {
        return new Promise<void>((resolve, reject) => {
            if (!this.ws) {
                resolve();
                return;
            }
            this.ws.onclose = () => { resolve(); };
            this.ws.onerror = (err) => { reject(err); };
            this.ws.close();
        });
    }

    public async sendRequest(moduleId: number, actionId: number, data: Uint8Array = new Uint8Array(0), flags: Flag = Flag.None) {
        return new Promise<Uint8Array | void>((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return reject(new Error('Not connected'));
            }

            const msgId = this.generateMsgId();
            const header = this.generateMessageHeader(moduleId, actionId, flags, msgId, data.length);
            const message = new Uint8Array(header.length + data.length);
            message.set(header, 0);
            message.set(data, header.length);
            this.ws.send(message);

            // if (flags & Flag.RequireAck) {
            //     this.pendingRequests.set(msgId, new PendingRequest(resolve, reject));
            // }
            // else resolve();
            this.pendingRequests.set(msgId, new PendingRequest(resolve, reject));
        });
    }
}