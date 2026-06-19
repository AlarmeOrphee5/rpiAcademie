const fs = require("fs");
const path = require("path");

function getSensorPath() {

    const basePath = "/sys/bus/w1/devices";

    const devices = fs.readdirSync(basePath);

    const sensor = devices.find(
        d => d.startsWith("28-")
    );

    if (!sensor) {
        throw new Error("DS18B20 introuvable");
    }

    return path.join(
        basePath,
        sensor,
        "w1_slave"
    );
}

function readTemperature() {

    const data = fs.readFileSync(
        getSensorPath(),
        "utf8"
    );

    const lines = data.split("\n");

    if (!lines[0].includes("YES")) {
        throw new Error(
            "Lecture du capteur invalide"
        );
    }

    const match = lines[1].match(/t=(-?\d+)/);

    if (!match) {
        throw new Error(
            "Température introuvable"
        );
    }

    return parseInt(match[1], 10) / 1000;
}

async function test() {

    const temperature = readTemperature();

    return {
        success: true,
        values: {
            temperature: {
                value: temperature.toFixed(2),
                unit: "°C"
            }
        }
    };
}

module.exports = {
    test
};