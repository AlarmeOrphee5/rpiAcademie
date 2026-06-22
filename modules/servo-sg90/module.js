const { Gpio } = require("pigpio");

let servo = null;

function setAngle(angle) {

    // Conversion angle -> impulsion
    const pulseWidth = 500 + (angle * 2000 / 180);

    servo.servoWrite(Math.round(pulseWidth));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
    servo = new Gpio(18, {
        mode: Gpio.OUTPUT
    });

    setAngle(0);
    await sleep(1000);

    setAngle(90);
    await sleep(1000);

    setAngle(180);
    await sleep(1000);

    setAngle(90);
    await sleep(1000);

    servo.servoWrite(0);
    
    servo = null;

    return {
        success: true,
        values: {
            servo: {
                state: "test termine"
            }
        }
    };
}

module.exports = {
    test
};