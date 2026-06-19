const { Gpio } = require("pigpio");

// GPIO (à adapter si besoin)
const DATA = new Gpio(17, { mode: Gpio.OUTPUT });
const CLOCK = new Gpio(27, { mode: Gpio.OUTPUT });
const LATCH = new Gpio(22, { mode: Gpio.OUTPUT });

function pulse(pin) {
    pin.digitalWrite(1);
    pin.digitalWrite(0);
}

/**
 * Envoie un octet au 74HC595
 */
function shiftOutByte(value) {

    for (let i = 7; i >= 0; i--) {

        const bit = (value >> i) & 1;

        DATA.digitalWrite(bit);

        pulse(CLOCK);
    }

    pulse(LATCH);
}

/**
 * Test logique du module
 */
async function test() {

    // Séquence pédagogique classique (fiable et standard)
    const sequence = [
        0b00000001,
        0b00000011,
        0b00000111,
        0b00001111,
        0b00011111,
        0b00111111,
        0b01111111,
        0b11111111,
        0b00000000
    ];

    for (const value of sequence) {

        shiftOutByte(value);

        await new Promise(r => setTimeout(r, 400));
    }

    return {
        success: true,
        values: {
            hc595: {
                state: "sequence_ok",
                steps: sequence.length
            }
        }
    };
}

module.exports = { test };