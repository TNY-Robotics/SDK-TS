import { DataWriter } from "../../core/DataWriter";
import { DataType } from "../../core/DataTypes";
import { Flag, Protocol } from "../../core/Protocol";
import { DataReader } from "../../core/DataReader";

export class Module {
    protected moduleId: number;
    protected protocol: Protocol;
    
    constructor(moduleId: number, protocol: Protocol) {
        this.protocol = protocol;
        this.moduleId = moduleId;

        if (this.moduleId < 0 || this.moduleId > 255) {
            throw new Error('Module ID must be between 0 and 255');
        }
    }

    protected async sendAction(actionId: number, inArgs: DataType[] = [], outArgs: DataType[] = [], flags: Flag = Flag.None): Promise<any[]|void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (actionId < 0 || actionId > 255) {
                    throw new Error(`Action ID ${actionId} must be between 0 and 255`);
                }

                const writer = new DataWriter();
                for (let i = 0; i < inArgs.length; i++) {
                    writer.write(inArgs[i]);
                }

                if (outArgs.length > 0) {
                    flags |= Flag.RequireAck;
                }

                const data = writer.toBytes();
                const response = await this.protocol.sendRequest(this.moduleId, actionId, data, flags);
                if ((!response || response.length === 0) && outArgs.length === 0) {
                    resolve();
                }
                else if (response instanceof Uint8Array) {
                    const reader = new DataReader(response);
                    const results: any[] = [];
                    for (let i = 0; i < outArgs.length; i++) {
                        results.push(reader.read(outArgs[i]).value);
                    }
                    resolve(results);
                }
                else {
                    return reject(new Error('Invalid response data'));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}