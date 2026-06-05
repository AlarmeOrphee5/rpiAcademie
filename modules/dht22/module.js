const sensor = require("node-dht-sensor");
//gpio 4
async function test() {

    return new Promise((resolve, reject) => {

        sensor.read(11, 4, (err, temperature, humidity) => {

            if (err) {
                reject(err);
                return;
            }

            resolve({
                success: true,
                values: {
                    temperature: {
                        value: temperature.toFixed(1),
                        unit: "°C"
                    },
                    humidite: {
                        value: humidity.toFixed(1),
                        unit: "%"
                    }
                }
            });

        });

    });
}

module.exports = {
    test
};