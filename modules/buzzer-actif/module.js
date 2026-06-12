const { Gpio } = require("pigpio");

const buzzer = new Gpio(18, {
    mode: Gpio.OUTPUT
});

function beep(duration = 500) {

    return new Promise((resolve) => {

        buzzer.digitalWrite(1);

        setTimeout(() => {

            buzzer.digitalWrite(0);

            resolve();

        }, duration);

    });
}

async function test() {

    for (let i = 0; i < 3; i++) {

        buzzer.digitalWrite(1);

        await new Promise(r => setTimeout(r, 200));

        buzzer.digitalWrite(0);

        await new Promise(r => setTimeout(r, 200));
    }

    return {
        success: true,
        message: "3 bips effectués"
    };
}

function stop() {
    buzzer.digitalWrite(0);
}

process.on("SIGINT", () => {
    stop();
    process.exit();
});

module.exports = {
    test,
    stop
};