const fs = require("fs");
const path = require("path");

const TEMPLATE_DIR = "./modules/template";
const MODULES_DIR = "./modules";

const moduleName = process.argv[2];
const moduleType = process.argv[3]; // A, C, M

const TYPE_MAP = {
    A: "actionneur",
    C: "capteur",
    M: "communication"
};

if (!moduleName || !moduleType) {
    console.log("❌ Utilisation : node create-module.js <nom> <A|C|M>");
    process.exit(1);
}

if (!TYPE_MAP[moduleType]) {
    console.log("❌ Type invalide. Utilise A, C ou M");
    process.exit(1);
}

const targetPath = path.join(MODULES_DIR, moduleName);

// sécurité si existe déjà
if (fs.existsSync(targetPath)) {
    console.log("❌ Ce module existe déjà !");
    process.exit(1);
}

// 1. créer dossier
fs.mkdirSync(targetPath, { recursive: true });

// 2. copier template
const files = fs.readdirSync(TEMPLATE_DIR);

files.forEach(file => {

    const src = path.join(TEMPLATE_DIR, file);
    const dest = path.join(targetPath, file);

    fs.copyFileSync(src, dest);
});

// 3. modifier module.json
const jsonPath = path.join(targetPath, "module.json");

const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

json.id = moduleName;
json.nom = moduleName;
json.description = "Description du module " + moduleName;
json.categorie = TYPE_MAP[moduleType];

fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));

console.log(`✅ Module "${moduleName}" (${TYPE_MAP[moduleType]}) créé avec succès !`);