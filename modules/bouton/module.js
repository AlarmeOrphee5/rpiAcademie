const { Gpio } = require("pigpio");

// GPIO du bouton
const button = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    alert: true
});

button.glitchFilter(10000); // anti-rebond 10ms

async function test() {

    return new Promise((resolve) => {

        const value = button.digitalRead();

        resolve({
            success: true,
            values: {
                button: {
                    "état logique" : value === 1 ? "appuyer" : "relacher",
                    raw: value
                }
            }
        });

    });
}

module.exports = {
    test
};