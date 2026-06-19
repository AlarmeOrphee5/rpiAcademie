const { Gpio } = require("pigpio");

const tilt = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP
});

async function test() {

    return {
        success: true,
        values: {
            tilt: {
                state: tilt.digitalRead()
                    ? "normal"
                    : "incline",
                raw: tilt.digitalRead()
            }
        }
    };
}

module.exports = {
    test
};