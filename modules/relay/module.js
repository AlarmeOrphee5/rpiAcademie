const { Gpio } = require("pigpio");

async function test() {

    const relay = new Gpio(17, { mode: Gpio.OUTPUT });

    relay.write(1);

    await new Promise(resolve => setTimeout(resolve, 1000));

    relay.write(0);

    return {
        success: true,
        values: {
            relay: {
                state: "ok"
            }
        }
    };
}

module.exports = { test };