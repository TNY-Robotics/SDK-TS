import { DataType } from "./DataTypes";

export class DataReader {
    private buffer: Uint8Array;
    private offset: number = 0;

    constructor(data: Uint8Array) {
        this.buffer = data;
    }

    read(type: DataType): DataType {
        if (this.buffer.length < this.offset + type.size()) {
            throw new Error('Not enough data to read');
        }
        const value = type.fromBytes(this.buffer, this.offset);
        this.offset += type.size();
        return value;
    }
}