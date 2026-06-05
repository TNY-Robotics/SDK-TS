import { Bool, UInt8 } from "../../core/DataTypes";
import { Module } from "./Module";

export class I2CModule extends Module {
    public static readonly MODULE_ID = 0x0E;

    constructor(protocol: any) {
        super(I2CModule.MODULE_ID, protocol);
    }

    public async probeDevice(address: number) {
        return await this.sendAction(0x00, [new UInt8(address)], [new Bool()]).then((res: any) => res[0] as boolean);
    }

    public async writeRegisters(address: number, register: number, data: number[]) {
        return await this.sendAction(0x01, [new UInt8(address), new UInt8(register), ...data.map((v) => new UInt8(v))], []);
    }

    public async readRegisters(address: number, register: number, length: number) {
        return await this.sendAction(0x02, [new UInt8(address), new UInt8(register), new UInt8(length)], [...Array.from({ length }, () => new UInt8())]).then((res: any) => res.map((v: any) => v as number));
    }
}
