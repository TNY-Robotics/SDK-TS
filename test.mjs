import { TNY360, JointId, GaitType, LegId } from "./dist/index.mjs";

async function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function main() {
    const robot = new TNY360('192.168.1.19');
    
    console.log('Connect ...')
    try {
        await robot.connect();
    } catch (err) { console.error(err.message); return; }

    // await robot.body.setEnabled(0b1111111111111111, true);
    await robot.body.setEnabled(0, true);
}
main();
