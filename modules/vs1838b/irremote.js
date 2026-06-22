/**
 * irremote.js
 * Réception et décodage IR via protocole NEC.
 *
 * Matériel : récepteur VS1838B
 * Branchement :
 *   VCC  ? 3.3V
 *   GND  ? GND
 *   DATA ? GPIO 17 (ou autre pin passée au constructeur)
 *
 * Protocole NEC :
 *   En-tête : ~9000µs HIGH + ~4500µs LOW
 *   Bit 0   : ~562µs marque + ~562µs espace  (espace court)
 *   Bit 1   : ~562µs marque + ~1687µs espace (espace long)
 *   32 bits au total, LSB en premier
 *   Trame répétition : ~9000µs HIGH + ~2250µs LOW + ~562µs (ignorée)
 */

const { Gpio } = require("pigpio");

class IRremote {

    constructor(pin = 17) {
        this.pin        = pin;
        this.ir         = null;
        this.lastTick   = 0;
        this.pulses     = [];
        this.listeners  = [];
        this._watchdog  = null;
    }

    /* =========================
       DÉMARRAGE
    ========================= */

    start() {

        if (this.ir) return;

        this.ir = new Gpio(this.pin, {
            mode:  Gpio.INPUT,
            alert: true
        });

        this.lastTick = 0;
        this.pulses   = [];

        this.ir.on("alert", (level, tick) => this._onSignal(level, tick));

        // Watchdog léger : détecte uniquement les trames orphelines
        this._watchdog = setInterval(() => this._flushOrphan(), 100);
    }

    /* =========================
       ARRÊT + LIBÉRATION GPIO
    ========================= */

    stop() {

        if (this._watchdog) {
            clearInterval(this._watchdog);
            this._watchdog = null;
        }

        if (this.ir) {
            this.ir.removeAllListeners("alert");
            this.ir = null;
        }

        this.pulses    = [];
        this.listeners = [];
        this.lastTick  = 0;
        this._lastPulseTime = null;
    }

    /* =========================
       RÉCEPTION SIGNAL
    ========================= */

    _onSignal(level, tick) {

        if (this.lastTick !== 0) {

            const duration = (tick - this.lastTick) >>> 0;

            if (duration > 80) {
                this.pulses.push({ duration, level });
                this._lastPulseTime = Date.now();

                // Tenter un décodage dès qu'on a assez de pulses
                // Une trame NEC = ~67 pulses, on tente à partir de 40
                if (this.pulses.length >= 40) {
                    this._tryDecode();
                }
            }
        }

        this.lastTick = tick;
    }

    /* =========================
       TENTATIVE DE DÉCODAGE
    ========================= */

    _tryDecode() {

        // Chercher l'en-tête NEC dans le buffer
        const headerIdx = this.pulses.findIndex(p =>
            p.level === 1 &&
            p.duration > 8000 &&
            p.duration < 10500
        );

        if (headerIdx === -1) {
            // Pas d'en-tête ? vider le bruit accumulé
            this.pulses = [];
            return;
        }

        // Vérifier le gap après l'en-tête
        const gap = this.pulses[headerIdx + 1];
        if (!gap) return; // pas encore reçu

        // Trame de répétition NEC : gap ~2250µs ? ignorer
        if (gap.duration < 3000) {
            this.pulses = this.pulses.slice(headerIdx + 3);
            return;
        }

        // Gap normal ~4500µs ? trame de données
        // Il nous faut au moins 32 paires de pulses après le gap
        const data = this.pulses.slice(headerIdx + 2);
        if (data.length < 64) return; // pas encore assez de bits

        const code = this._decodeTrame(data);

        // Vider le buffer jusqu'après cette trame
        this.pulses = this.pulses.slice(headerIdx + 2 + 65);

        if (code) {
            this.listeners.forEach(cb => cb(code));
        }
    }

    /* =========================
       NETTOYAGE TRAMES ORPHELINES
       (buffer qui n'a pas pu être décodé)
    ========================= */

    _flushOrphan() {

        if (this.pulses.length === 0) return;
        if (!this._lastPulseTime) return;

        // Si aucun pulse depuis 200ms ? vider le buffer résiduel
        if (Date.now() - this._lastPulseTime > 200) {
            this.pulses = [];
            this._lastPulseTime = null;
        }
    }

    /* =========================
       DÉCODAGE PROTOCOLE NEC
    ========================= */

    _decodeTrame(data) {

        const bits = [];

        for (let i = 0; i < data.length - 1; i += 2) {

            const marque = data[i];     // HIGH
            const espace = data[i + 1]; // LOW

            if (!marque || !espace) break;

            const d = espace.duration;

            if (d > 300 && d < 900) {
                bits.push(0); // espace court ? bit 0
            } else if (d > 1200 && d < 2000) {
                bits.push(1); // espace long  ? bit 1
            } else {
                break; // hors plage ? fin des bits valides
            }

            if (bits.length === 32) break;
        }

        if (bits.length < 32) return null;

        // Construire la valeur 32 bits LSB first
        let value = 0;
        for (let i = 0; i < 32; i++) {
            value |= bits[i] << i;
        }

        return "0x" + (value >>> 0).toString(16).toUpperCase().padStart(8, "0");
    }

    /* =========================
       ATTENTE D'UNE TOUCHE
    ========================= */

    waitKey(timeout = 5000) {

        return new Promise((resolve) => {

            let done = false;

            const timer = setTimeout(() => {
                if (done) return;
                done = true;
                this.listeners = this.listeners.filter(h => h !== handler);
                resolve(null);
            }, timeout);

            const handler = (code) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                this.listeners = this.listeners.filter(h => h !== handler);
                resolve(code);
            };

            this.listeners.push(handler);
        });
    }
}

module.exports = IRremote;