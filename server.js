const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const os = require("os");

const app = express();
const PORT = 3000;

/* =========================
   FRONT STATIC
========================= */

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        erreur: "Trop de requêtes, attendez un moment."
    }
});

app.use("/api", limiter);

app.use(express.static(path.join(__dirname, "public")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

app.use((req, res, next) => {

    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net"
    );

    next();
});

/* =========================
   API : LISTE MODULES
========================= */

app.get("/api/modules", (req, res) => {

    const modulesDir = path.join(__dirname, "modules");

    const modules = [];

    const folders = fs.readdirSync(modulesDir);

    folders.forEach(folder => {

        if (folder === "template") return;

        const modulePath = path.join(
            modulesDir,
            folder
        );

        const jsonPath = path.join(
            modulePath,
            "module.json"
        );

        if (!fs.existsSync(jsonPath)) return;

        try {

            const raw = fs.readFileSync(
                jsonPath,
                "utf8"
            );

            const data = JSON.parse(raw);

            modules.push(data);

        } catch (err) {

            console.log(
                `Erreur JSON dans ${folder}`,
                err.message
            );
        }
    });

    res.json(modules);
});

/* =========================
   API : MODULE COMPLET
========================= */

app.get("/api/module/:id", (req, res) => {

    try {

        const moduleId = req.params.id;

        if (!/^[a-z0-9_-]+$/.test(moduleId)) {
            return res.status(400).json({
                erreur: "ID invalide"
            });
        }

        const modulePath = path.join(
            __dirname,
            "modules",
            moduleId
        );

        const json = JSON.parse(
            fs.readFileSync(
                path.join(modulePath, "module.json"),
                "utf8"
            )
        );

        const cours = fs.readFileSync(
            path.join(modulePath, "cours.md"),
            "utf8"
        );

        res.json({
            ...json,
            cours
        });

    } catch (err) {

        res.status(404).json({
            erreur: `Module introuvable : ${err.message}`
        });
    }
});

/* =========================
   API : TEST MODULE
========================= */

app.post("/api/test/:id", async (req, res) => {

    try {
        //console.log("Test demandé :", req.params.id);
        const moduleId = req.params.id;

        if (!/^[a-z0-9_-]+$/.test(moduleId)) {
            return res.status(400).json({
                success: false,
                erreur: "ID invalide"
            });
        }

        const modulePath = path.join(
            __dirname,
            "modules",
            moduleId,
            "module.js"
        );
        
        const jsonPath = path.join(
            __dirname,
            "modules",
            moduleId,
            "module.json"
        );

        if (!fs.existsSync(modulePath)) {
            return res.status(404).json({
                success: false,
                erreur: "module.js introuvable"
            });
        }
        
        if (!fs.existsSync(jsonPath)) {
            return res.status(404).json({
                success: false,
                erreur: "module.json introuvable"
            });
        }

        const moduleConfig = require(jsonPath);

        delete require.cache[
            require.resolve(modulePath)
        ];

        const module = require(modulePath);

        if (typeof module.test !== "function") {
            throw new Error(
                "Fonction test() introuvable"
            );
        }
        //console.log("Module chargé :", moduleId);
        //console.log("Lancement du test");

        const result = await module.test(moduleConfig);
        console.log("resultat du test");
        console.log(result);

        res.json(
            result || {
                success: true
            }
        );

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            erreur: err.message
        });
    }
});

/* =========================
   OUTILS
========================= */

function getLocalIP() {

    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {

        for (const net of interfaces[name]) {

            if (
                net.family === "IPv4" &&
                !net.internal
            ) {
                return net.address;
            }
        }
    }

    return "localhost";
}

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    const ip = getLocalIP();

    console.log(
        `Serveur démarré : http://${ip}:${PORT}`
    );
});