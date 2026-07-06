/**
 * module.js — Module IR VS1838B
 * Compatible RpiAcademie : expose test(), start(), stop()
 *
 * Branchement :
 *   VCC  → 3.3V
 *   GND  → GND
 *   DATA → GPIO 17
 */

const IRremote = require("../../assets/irremote");

// Instance unique — le GPIO n'est PAS alloué ici
const remote = new IRremote(17);

/* =========================
   MODE TEST PONCTUEL
   Appelé par POST /api/test/:id
========================= */

async function test() {
    try {
        remote.start();
        const code = await remote.waitKey(5000);

        // Attendre que le watchdog ait fini de vider le buffer
        await new Promise(r => setTimeout(r, 200));

        remote.stop();

        if (!code) {
            return {
                success: false,
                message: "Aucune touche d�tect�e � appuyez sur une touche de la t�l�commande"
            };
        }

        return {
            success: true,
            values: {
                code: { value: code, unit: "" }
            }
        };

    } catch (err) {
        remote.stop();
        return { success: false, message: `Erreur IR : ${err.message}` };
    }
}

/* =========================
   MODE CONTINU
   Pour future intégration startTest() / stopTest()
   callback : fonction appelée à chaque touche reçue
========================= */

function start(callback) {

    remote.start();

    // On enregistre un listener permanent
    const handler = (code) => {
        callback({
            success: true,
            values: {
                code: { value: code, unit: "" }
            }
        });
    };

    remote.listeners.push(handler);
}

function stop() {
    remote.stop();
}

module.exports = { test, start, stop };