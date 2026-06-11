export interface DataType {
    readonly value: any;
    size(): number;
    toBytes(): Uint8Array;
    fromBytes(array: Uint8Array, offset: number): DataType;
}

export class UInt8 implements DataType {
    public readonly value: number;

    constructor(value?: number) {
        if (value === undefined) {
            this.value = 0;
            return;
        }
        if (value < 0 || value > 0xFF) {
            throw new RangeError('Value must be between 0 and 255');
        }
        this.value = value;
    }

    size(): number {
        return 1;
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(1);
        bytes[0] = this.value;
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): UInt8 {
        if (array.length < offset + 1) {
            throw new Error('Invalid byte array length');
        }
        return new UInt8(array[offset]);
    }
}

export class UInt16 implements DataType {
    public readonly value: number;

    constructor(value?: number) {
        if (value === undefined) {
            this.value = 0;
            return;
        }
        if (value < 0 || value > 0xFFFF) {
            throw new RangeError('Value must be between 0 and 65535');
        }
        this.value = value;
    }

    size(): number {
        return 2;
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(2);
        bytes[0] = this.value & 0xFF;
        bytes[1] = (this.value >> 8) & 0xFF;
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): UInt16 {
        if (array.length < offset + 2) {
            throw new Error('Invalid byte array length');
        }
        const value = array[offset] | (array[offset + 1] << 8);
        return new UInt16(value);
    }
}

export class UInt32 implements DataType {
    public readonly value: number;

    constructor(value?: number) {
        if (value === undefined) {
            this.value = 0;
            return;
        }
        if (value < 0 || value > 0xFFFFFFFF) {
            throw new RangeError('Value must be between 0 and 4294967295');
        }
        this.value = value;
    }

    size(): number {
        return 4;
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(4);
        bytes[0] = this.value & 0xFF;
        bytes[1] = (this.value >> 8) & 0xFF;
        bytes[2] = (this.value >> 16) & 0xFF;
        bytes[3] = (this.value >> 24) & 0xFF;
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): UInt32 {
        if (array.length < offset + 4) {
            throw new Error('Invalid byte array length');
        }
        const value = array[offset] | (array[offset + 1] << 8) | (array[offset + 2] << 16) | (array[offset + 3] << 24);
        return new UInt32(value);
    }
}

export class Float32 implements DataType {
    public readonly value: number;

    constructor(value?: number) {
        if (value === undefined) {
            this.value = 0;
            return;
        }
        this.value = value;
    }

    size(): number {
        return 4;
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(4);
        const floatArray = new Float32Array([this.value]);
        const uint8Array = new Uint8Array(floatArray.buffer);
        bytes.set(uint8Array);
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): Float32 {
        if (array.length < offset + 4) {
            throw new Error('Invalid byte array length');
        }
        const floatArray = new Float32Array(1);
        const uint8Array = new Uint8Array(floatArray.buffer);
        uint8Array[0] = array[offset];
        uint8Array[1] = array[offset + 1];
        uint8Array[2] = array[offset + 2];
        uint8Array[3] = array[offset + 3];
        return new Float32(floatArray[0]);
    }
}

export class Bool implements DataType {
    public readonly value: boolean;

    constructor(value?: boolean) {
        if (value === undefined) {
            this.value = false;
            return;
        }
        this.value = value;
    }

    size(): number {
        return 1;
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(1);
        bytes[0] = this.value ? 1 : 0;
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): Bool {
        if (array.length < offset + 1) {
            throw new Error('Invalid byte array length');
        }
        return new Bool(array[offset] !== 0);
    }
}

export class StringType implements DataType {
    public readonly value: string;

    constructor(value?: string) {
        if (value === undefined) {
            this.value = '';
            return;
        }
        if (value.length > 0xFFFF) {
            throw new RangeError('String length must be between 0 and 65535');
        }
        for (let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 0xFF) {
                throw new RangeError('String must contain only ASCII characters');
            }
        }
        this.value = value;
    }

    size(): number {
        return this.value.length + 2; // 2 bytes for length prefix
    }

    toBytes(): Uint8Array {
        const bytes = new Uint8Array(this.value.length + 2);
        bytes[0] = this.value.length & 0xFF;
        bytes[1] = (this.value.length >> 8) & 0xFF;
        for (let i = 0; i < this.value.length; i++) {
            bytes[i + 2] = this.value.charCodeAt(i);
        }
        return bytes;
    }

    fromBytes(array: Uint8Array, offset: number): StringType {
        if (array.length < offset + 2) {
            throw new Error('Invalid byte array length (missing length prefix)');
        }
        const length = array[offset] | (array[offset + 1] << 8);
        if (array.length < offset + 2 + length) {
            throw new Error('Invalid byte array length (incomplete string)');
        }
        let string = '';
        for (let i = 0; i < length; i++)
        {
            string += String.fromCharCode(array[offset + 2 + i]);
        }
        return new StringType(string);
    }
}