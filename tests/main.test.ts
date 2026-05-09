import { describe, it } from 'vitest';

import { TNY360 } from "../src/robots";

describe('Robot ping test', () => {
    it('Should connect to robot and ping', async () => {
        console.log('Creating TNY-360');
        const robot = new TNY360('192.168.4.1');

        try {
            console.log('Connecting to TNY-360 ...');
            await robot.connect();
        } catch (err) {
            console.error('TNY360 Connection error : ', err);
            return;
        }

        console.log('Connected to TNY-360!');

        console.log('sending ping ...');
        const start = Date.now();
        for (let i = 0; i < 10; i++) await robot.system.ping();
        const end = Date.now();
        console.log(`Average reponse time : ${ (end - start) / 10 } ms.`);
    });
});