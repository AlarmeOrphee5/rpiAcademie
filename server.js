const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const https = require("https");

// ─── Configuration GitHub ─────────────────────────────────────────────────
const GITHUB_USER   = "AlarmeOrphee5";
const GITHUB_REPO   = "rpiAcademie";
const GITHUB_BRANCH = "main";
const GITHUB_API    = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/modules`;
const RAW_BASE      = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/modules`;

// Cache pour ne pas interroger GitHub à chaque requête
let storeCache     = null;
let storeCacheTime = 0;
const CACHE_TTL    = 5 * 60 * 1000; // 5 minutes

// Fichiers attendus dans chaque module
const MODULE_FILES = ["module.json", "cours.md", "module.js", "image.svg", "schema.png"];

const app = express();
const PORT = 3000;

/* =========================
   FRONT STATIC
========================= */
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,            // 100 requêtes max par minute par IP
    message: { erreur: "Trop de requêtes, attendez un moment." }
});

app.use("/api", limiter);
app.use(express.static(path.join(__dirname, "public")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", 
        "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net"
    );
    next();
});

/* =========================
   API : LISTE MODULES
========================= */
app.get("/api/modules", (req, res) => {

    const modulesDir = path.join(__dirname, "modules");

    let modules = [];

    const folders = fs.readdirSync(modulesDir);

    folders.forEach(folder => {

        // 👉 IGNORE TEMPLATE
        if (folder === "template") return;

        const modulePath = path.join(modulesDir, folder);
        const jsonPath = path.join(modulePath, "module.json");

        if (fs.existsSync(jsonPath)) {

            try {
                const raw = fs.readFileSync(jsonPath, "utf8");
                const data = JSON.parse(raw);

                modules.push(data);

            } catch (err) {
                console.log(`Erreur JSON dans ${folder}`, err.message);
            }
        }
    });

    res.json(modules);
});

/* =========================
   API : COURS MD
========================= */

app.get("/api/module/:id", (req, res) => {
    try {
        const moduleId = req.params.id;
        // Sécurité : empêcher ../../../etc/passwd
        if (!/^[a-z0-9_-]+$/.test(moduleId)) {
            return res.status(400).json({ erreur: "ID invalide" });
        }
        const modulePath = path.join(__dirname, "modules", moduleId);
        const json = JSON.parse(fs.readFileSync(path.join(modulePath, "module.json"), "utf8"));
        const cours = fs.readFileSync(path.join(modulePath, "cours.md"), "utf8");
        res.json({ ...json, cours });
    } catch (err) {
        res.status(404).json({ erreur: `Module introuvable : ${err.message}` });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});

/* ── Utilitaire : requête HTTPS → Promise ── */
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { "User-Agent": "rpiAcademie" } // obligatoire pour l'API GitHub
        };
        https.get(url, options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                if (res.statusCode === 200) resolve(data);
                else reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
            });
        }).on("error", reject);
    });
}

/* ── GET /api/store ── */
app.get("/api/store", async (req, res) => {
    try {
        // Utiliser le cache si encore valide
        const maintenant = Date.now();
        if (storeCache && (maintenant - storeCacheTime) < CACHE_TTL) {
            return res.json(storeCache);
        }

        // Lister les dossiers /modules sur GitHub
        const raw      = await httpsGet(GITHUB_API);
        const contenu  = JSON.parse(raw);
        const dossiers = contenu.filter(item => item.type === "dir");

        // Lister les modules déjà installés localement
        const modulesDir  = path.join(__dirname, "modules");
        const installes   = fs.readdirSync(modulesDir)
            .filter(f => f !== "template");

        // Construire la liste : installé ou non
        const catalogue = dossiers.map(dossier => ({
            id:        dossier.name,
            installe:  installes.includes(dossier.name),
            githubUrl: dossier.html_url,
        }));

        // Enrichir avec module.json pour les non installés
        for (const module of catalogue) {
            if (!module.installe) {
                try {
                    const jsonRaw  = await httpsGet(`${RAW_BASE}/${module.id}/module.json`);
                    const jsonData = JSON.parse(jsonRaw);
                    module.nom         = jsonData.nom;
                    module.description = jsonData.description;
                    module.categorie   = jsonData.categorie;
                    module.image       = jsonData.image;
                    module.difficulte  = jsonData.difficulte;
                } catch {
                    module.nom = module.id; // fallback
                }
            }
        }

        storeCache     = { succes: true, catalogue };
        storeCacheTime = maintenant;

        res.json(storeCache);

    } catch (err) {
        res.status(500).json({
            succes: false,
            erreur: `Impossible de contacter GitHub : ${err.message}`
        });
    }
});

/* ── POST /api/store/install/:id ── */
app.post("/api/store/install/:id", async (req, res) => {
    try {
        const moduleId = req.params.id;

        // Validation stricte de l'ID
        if (!/^[a-z0-9_-]+$/.test(moduleId)) {
            return res.status(400).json({ erreur: "ID invalide" });
        }

        const destDir = path.join(__dirname, "modules", moduleId);

        // Ne pas réinstaller si déjà présent
        if (fs.existsSync(destDir)) {
            return res.status(409).json({ erreur: "Module déjà installé" });
        }

        // Créer le dossier local
        fs.mkdirSync(destDir, { recursive: true });

        // Télécharger chaque fichier du module
        const erreurs = [];
        for (const fichier of MODULE_FILES) {
            try {
                const url     = `${RAW_BASE}/${moduleId}/${fichier}`;
                const contenu = await httpsGet(url);
                fs.writeFileSync(path.join(destDir, fichier), contenu);
            } catch {
                erreurs.push(fichier); // certains fichiers sont optionnels
            }
        }

        // Vérifier que le minimum est présent
        const moduleJsonPath = path.join(destDir, "module.json");
        if (!fs.existsSync(moduleJsonPath)) {
            fs.rmSync(destDir, { recursive: true });
            return res.status(500).json({ erreur: "Échec : module.json introuvable sur GitHub" });
        }

        // Invalider le cache
        storeCache = null;

        res.json({
            succes:  true,
            message: `Module "${moduleId}" installé avec succès.`,
            erreursFichiers: erreurs.length ? erreurs : undefined
        });

    } catch (err) {
        res.status(500).json({ erreur: `Erreur installation : ${err.message}` });
    }
});