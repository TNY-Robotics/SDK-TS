<div align="center">

# @tny-robotics/sdk

[![npm version](https://img.shields.io/npm/v/@tny-robotics/sdk.svg?color=blue)](https://www.npmjs.com/package/@tny-robotics/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**The official TypeScript/JavaScript SDK for all TNY Robotics robots**

[🌐 Website](https://tny-robotics.com/) • [📦 NPM Package](https://www.npmjs.com/package/@tny-robotics/sdk) • [💬 Discord](https://discord.gg/XGABkx5A4y)

</div>

---

## 🚀 Overview

`@tny-robotics/sdk` provides a clean, promise-based API to communicate with your TNY Robotics robot.

It handles all the complex binary WebSocket framing under the hood, letting you focus on building amazing apps, dashboards, or block-based programming interfaces (like [TNY-Coder](https://github.com/TNY-Robotics/TNY-Coder)).

### ✨ Features
* **Universal (Isomorphic):** Works flawlessly in Node.js (Electron, backends) and in the Browser (Nuxt, Vue, React).
* **Fully Typed:** Written in TypeScript for perfect auto-completion and Developer Experience (DX).
* **Modular:** Access robot features cleanly through dedicated modules (`robot.system`, `robot.joint`, `robot.power`, etc.).
<!-- * **Smart Streaming:** Built-in subscription manager for sensor streams (IMU, Lidar) to optimize bandwidth. -->
---

## 📦 Installation

Install the package using your favorite package manager:

```bash
npm install @tny-robotics/sdk
# or
yarn add @tny-robotics/sdk
# or
pnpm add @tny-robotics/sdk
```

---

## 💻 Quick Start

Here is a simple example to connect to your TNY-360 and test the connection latency:

```typescript
import { TNY360 } from '@tny-robotics/sdk';

async function main() {
    console.log('Creating TNY-360 instance...');
    // Replace with your robot's IP address
    const robot = new TNY360('192.168.4.1');

    try {
        console.log('Connecting to TNY-360...');
        await robot.connect();
        console.log('Connected successfully!');
    } catch (err) {
        console.error('Connection error:', err);
        return;
    }

    // Ping test
    console.log('Sending pings...');
    const start = Date.now();
    for (let i = 0; i < 10; i++) {
        await robot.system.ping();
    }
    const end = Date.now();
    
    console.log(`Average response time: ${(end - start) / 10} ms.`);
}

main();

```

---

## 🧩 API Structure

The SDK is organized into intuitive modules. Here are some examples of what you can do:

### System & Settings

```typescript
// Get robot statistics
const stats = await robot.system.getStats();
console.log(`Temperature: ${stats.temp_c}°C, CPU0 Usage: ${stats.cpu_usage.core0}%`);

// Change AutoLife mode
import { AutoLifeLevel } from '@tny-robotics/sdk';
await robot.system.setAutoLifeLevel(AutoLifeLevel.Safeguard);

```

### Motion & Joints

```typescript
// Set the front-right knee joint to 30 degrees
await robot.joint.setAngle(JointId.FrontRightKneePitch, 30 * (Math.PI / 180));

// Get the current angle of the back-left hip roll joint
const curAngle = await robot.joint.getFeedbackAngle(JointId.BackLeftHipRoll);
console.log(`Current Hip Roll Angle: ${curAngle * (180 / Math.PI)} degrees`);

```

### Sensors & Telemetry *(Coming soon)*

```typescript
// Subscribe to continuous Lidar distance updates
// const unsubscribe = robot.laser.distance.subscribe((dist) => {
//     console.log(`Lidar Distance: ${dist} meters`);
// });

```

---

## 🤝 Contributing

This SDK is part of the open-source TNY-Robotics ecosystem.
Found a bug or want to add a new module? [Open an Issue](https://www.google.com/search?q=https://github.com/TNY-Robotics/SDK-TS/issues) or submit a Pull Request!

## 📄 License

This SDK is licensed under the **MIT License**.
*You are free to use it in your open-source or commercial applications, just include the copyright notice.*

Need help? Contact us [by mail]() or join our [Discord](https://discord.gg/XGABkx5A4y).
