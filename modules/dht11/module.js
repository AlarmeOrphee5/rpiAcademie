const sensor = require("node-dht-sensor");
//gpio 4

let interval = null;

/**
 * Lecture unique du DHT11
 */
function readOnce() {

    return new Promise((resolve, reject) => {

        sensor.read(11, 4, (err, temperature, humidity) => {

            if (err) {
                return reject(err);
            }

            resolve({
                success: true,
                values: {
                    temperature: {
                        value: Number(temperature.toFixed(1)),
                        unit: "°C"
                    },
                    humidity: {
                        value: Number(humidity.toFixed(1)),
                        unit: "%"
                    }
                }
            });

        });

    });
}

/**
 * Test simple (compatible ton système actuel)
 */
async function test() {
    return await readOnce();
}

/**
 * Démarrage mode continu (pour futur WebSocket)
 * callback = fonction appelée à chaque mesure
 */
function start(callback, delay = 2000) {

    if (interval) clearInterval(interval);

    interval = setInterval(async () => {

        try {
            const data = await readOnce();
            callback(data);
        } catch (err) {
            callback({
                success: false,
                error: err.message
            });
        }

    }, delay);
}

/**
 * Stop du flux
 */
function stop() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

module.exports = {
    test,
    start,
    stop
};