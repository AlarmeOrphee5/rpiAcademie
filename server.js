const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

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

    try {

        const modulesDir = path.join(__dirname, "modules");
        const modules    = [];
        const folders    = fs.readdirSync(modulesDir);

        folders.forEach(folder => {

            if (folder === "template") return;
            if (folder.startsWith(".")) return;

            const modulePath = path.join(modulesDir, folder);
            const jsonPath   = path.join(modulePath, "module.json");

            if (!fs.existsSync(jsonPath)) return;

            try {

                delete require.cache[require.resolve(jsonPath)];

                const raw  = fs.readFileSync(jsonPath, "utf8");
                const data = JSON.parse(raw);

                modules.push(data);

            } catch (err) {
                // Un module cassé ne fait pas planter toute la liste
                console.warn(`[modules] Erreur dans ${folder} :`, err.message);
            }
        });

        res.json(modules);

    } catch (err) {

        console.error("[modules] Erreur lecture dossier :", err.message);
        res.status(500).json({
            erreur: "Impossible de lire la liste des modules"
        });
    }
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

        delete require.cache[require.resolve(jsonPath)];
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
   VERSIONNING ROUND
========================= */
app.get("/api/version", (req, res) => {
    const packageJson = require("./package.json");
    res.json({
        version: packageJson.version
    });
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
app.use((err, req, res, next) => {
    console.error("Erreur non gérée :", err.message);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
});

app.listen(PORT, () => {

    const ip = getLocalIP();

    console.log(
        `Serveur démarré : http://${ip}:${PORT}`
    );
});

/* =========================
   STOP SERVER
========================= */

function arretPropre() {
    console.log("Arrêt propre du serveur...");
    process.exit(0);
}

process.on("SIGINT",  arretPropre);
process.on("SIGTERM", arretPropre);