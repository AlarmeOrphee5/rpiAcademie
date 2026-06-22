const { Gpio } = require("pigpio");

const buzzer = null;

function playTone(frequency, duration) {

    return new Promise((resolve) => {

        buzzer.hardwarePwmWrite(
            frequency,
            500000
        ); // 50%

        setTimeout(() => {

            buzzer.hardwarePwmWrite(0, 0);

            resolve();

        }, duration);

    });
}

async function test() {

    console.log("Test buzzer passif");
    buzzer = new Gpio(18, {
        mode: Gpio.OUTPUT
    });

    // Do
    await playTone(262, 500);

    // Mi
    await playTone(330, 500);

    // Sol
    await playTone(392, 500);

    return {
        success: true,
        values: {
            status: {
                value: "Mélodie jouée"
            }
        }
    };
}

function stop() {
    buzzer.hardwarePwmWrite(0, 0);
}

process.on("SIGINT", () => {
    stop();
    process.exit();
});

module.exports = {
    test,
    stop
};