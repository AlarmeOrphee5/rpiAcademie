const { Gpio } = require("pigpio");

const LED = new Gpio(17, { mode: Gpio.OUTPUT });
//gpio 17

let interval = null;
let state = 0;

/* =========================
   START BLINK
========================= */
function startBlink(speed = 500) {

    if (interval) return;

    interval = setInterval(() => {

        state = state ^ 1;
        LED.digitalWrite(state);

    }, speed);
}

/* =========================
   STOP BLINK
========================= */
function stop() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    state = 0;
    LED.digitalWrite(0);
}

/* =========================
   TEST (auto 5s)
========================= */
async function test() {

    console.log("Test LED démarré");

    startBlink();

    await new Promise(resolve => setTimeout(resolve, 5000));

    stop();

    return {
        success: true,
        values: {
            resultat: "LED clignotée pendant 5 secondes"
        }
    };
}

/* =========================
   CLEAN EXIT
========================= */
process.on("SIGINT", () => {
    stop();
    process.exit();
});

process.on("exit", () => {
    stop();
});

/* =========================
   EXPORT
========================= */
module.exports = {
    startBlink,
    stop,
    test
};