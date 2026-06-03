import { TNY360 } from "./dist/index.mjs";

async function main() {
    const robot = new TNY360('192.168.137.48');

    console.log("Connecting to the robot...");
    try { await robot.connect(); }
    catch (e) { console.error("Failed to connect to the robot:", e); return; }

    while (true) {
        console.log("Getting ADC channel values...");
        try {
            const adcValues = await robot.adc.getAllChannels();
            // Format values to 2 decimal places and present as a markdown array
            const formatted = '[' + adcValues.map(v => Number(v).toFixed(2)).join(', ') + ']';
            console.log("ADC Channel Values:\n```js\n" + formatted + "\n```");
        }
        catch (e) { console.error("Failed to get ADC channel values:", e); }
    }
}
main();