import { DataType } from "./DataTypes";

export class DataWriter {
    private buffer: DataType[] = []; 

    constructor() {}

    write(data: DataType): DataWriter {
        this.buffer.push(data);
        return this;
    }

    toBytes(): Uint8Array {
        const totalSize = this.buffer.reduce((sum, data) => sum + data.size(), 0);
        const bytes = new Uint8Array(totalSize);
        let offset = 0;
        for (const data of this.buffer) {
            bytes.set(data.toBytes(), offset);
            offset += data.size();
        }
        return bytes;
    }

    size(): number {
        return this.buffer.reduce((sum, data) => sum + data.size(), 0);
    }
}