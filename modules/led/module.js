// module.js - LED clignotante

const Gpio = require("onoff").Gpio;

/* =========================
   CONFIGURATION
========================= */

// ⚠️ Change ce GPIO selon ton montage
const LED_PIN = 17;

// Création de la LED en sortie
const led = new Gpio(LED_PIN, "out");

/* =========================
   LOGIQUE MODULE
========================= */

let interval = null;

/**
 * Démarre le clignotement
 * @param {number} speed - vitesse en ms (ex: 500)
 */
function startBlink(speed = 500) {

    if (interval) return;

    let state = 0;

    interval = setInterval(() => {

        state = state ^ 1; // toggle 0/1
        led.writeSync(state);

        console.log(`LED: ${state ? "ON" : "OFF"}`);

    }, speed);
}

/**
 * Stop la LED
 */
function stop() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    led.writeSync(0);
}

/**
 * Test simple du module
 */
function test() {

    console.log("Test LED démarré");

    startBlink(500);

    setTimeout(() => {
        stop();
        console.log("Test LED terminé");
    }, 5000);
}

/* =========================
   CLEAN EXIT (important sur Raspberry Pi)
========================= */

process.on("SIGINT", () => {
    stop();
    led.unexport();
    process.exit();
});

/* =========================
   EXPORT (si tu veux l'utiliser ailleurs)
========================= */

module.exports = {
    startBlink,
    stop,
    test
};