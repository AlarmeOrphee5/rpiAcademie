const { Gpio } = require("pigpio");

const servo = new Gpio(18, {
    mode: Gpio.OUTPUT
});

function setAngle(angle) {

    // Conversion angle -> impulsion
    const pulseWidth = 500 + (angle * 2000 / 180);

    servo.servoWrite(Math.round(pulseWidth));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {

    setAngle(0);
    await sleep(1000);

    setAngle(90);
    await sleep(1000);

    setAngle(180);
    await sleep(1000);

    setAngle(90);
    await sleep(1000);

    servo.servoWrite(0);

    return {
        success: true,
        values: {
            servo: {
                angle: 90,
                state: "test termine"
            }
        }
    };
}

module.exports = {
    test
};