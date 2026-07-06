let modulesData = [];
marked.use({ breaks: true });
let interval = null;
let currentModuleId = null;

/* =========================
   UTILITAIRE
========================= */
function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================
   INITIALISATION
========================= */

async function init() {
    try {
        const res = await fetch("/api/modules");
        if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
        modulesData = await res.json();
        renderHome(modulesData);
         chargerVersion();
    } catch (err) {
        document.getElementById("app").innerHTML = `<p class="erreur">❌ Impossible de charger les modules : ${err.message}</p>`;
    }
}

/* =========================
   PAGE ACCUEIL
========================= */

function renderHome(modules) {

    const app = document.getElementById("app");

    const grouped = {
        actionneur: [],
        capteur: [],
        communication: [],
        projet: []
    };

    modules.forEach(m => {

        if (!m.categorie) {
            console.warn("Module sans catégorie :", m);
            return;
        }

        if (grouped[m.categorie]) {
            grouped[m.categorie].push(m);
        }
    });

    app.innerHTML = `
        <div class="welcome-card" data-id="avant-de-commencer">

            <h2>📖 Avant de commencer</h2>

            <p>
                Découvrez les GPIO, les tensions 3.3V/5V,
                la breadboard et les bonnes pratiques avant
                de réaliser vos premiers montages.
            </p>

        </div>
        <h2>Choisis un module</h2>

        ${renderSection("🔴 Actionneurs", grouped.actionneur)}
        ${renderSection("🔵 Capteurs", grouped.capteur)}
        ${renderSection("🟣 Communication", grouped.communication)}
        ${renderSection("🟣 Projets", grouped.projet)}
    `;
}

/* =========================
   SECTION MODULES
========================= */

function renderSection(title, modules) {

    if (!modules.length) return "";

    return `
        <div class="section">

            <h3>${escapeHtml(title)} (${modules.length})</h3>

            <div class="grid">

                ${modules.map(m => `

                    <div class="card diff-${m.difficulte || 1}" data-id="${escapeHtml(m.id)}">

                        <div class="difficulty-badge">
                            ${m.difficulte || 1}
                        </div>

                        <img
                            src="/modules/${escapeHtml(m.id)}/${escapeHtml(m.image)}"
                            alt="${escapeHtml(m.nom)}"
                        >

                        <h3>${escapeHtml(m.nom)}</h3>

                        <p>${escapeHtml(m.description)}</p>

                    </div>

                `).join("")}

            </div>

        </div>
    `;
}

/* =========================
   OUVERTURE MODULE
========================= */

async function openModule(id) {
    try{
        const response = await fetch(`/api/module/${id}`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        
        const lecteurModule = await response.json();

        renderModule(lecteurModule);
    } catch (err) {
        document.getElementById("app").innerHTML = 
            `<p class="erreur">❌ Impossible de charger les modules : ${err.message}</p>`;
    }
}

/* =========================
   PAGE MODULE
========================= */

function renderModule(module) {
    console.log(module);
    
    stopTest(); // 🔥 IMPORTANT

    currentModuleId = module.id;
    const app = document.getElementById("app");
    
    const refresh = module.test?.refresh || 0;

    app.innerHTML = `

        <button onclick="goHome()">
            ← Retour
        </button>

        <h2>${escapeHtml(module.nom)}</h2>

        <p>${escapeHtml(module.description)}</p>

        <hr>

        <h3>Cours</h3>

        <div class="cours">
            ${marked.parse(module.cours)}
        </div>

        <hr>

    ${refresh > 0 ? `
        <button class="btn-start"
            data-id="${escapeHtml(module.id)}"
            data-refresh="${refresh}">
            ▶ Démarrer
        </button>

        <button class="btn-stop">
            ⏹ Arrêter
        </button>
    ` : `
        <button class="btn-tester"
            data-id="${escapeHtml(module.id)}">
            🧪 Tester
        </button>
    `}
    <div id="output"></div>
    `;
}

/* =========================
   RETOUR ACCUEIL
========================= */

function goHome() {

    stopTest();
    renderHome(modulesData);
}

/* =========================
   VERSIONNING
========================= */
async function chargerVersion() {

    try {

        const res = await fetch("/api/version");
        const data = await res.json();

        document.getElementById("versionApp").textContent =
            `v${data.version}`;

    } catch (err) {

        document.getElementById("versionApp").textContent =
            "version inconnue";
    }
}

/* =========================
   TEST MODULE
========================= */

async function testerModule(id) {

    try {

        const res = await fetch(`/api/test/${id}`, {
            method: "POST"
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.erreur);
        }

        afficherResultat(data);

    } catch (err) {

        document.getElementById("output").innerHTML = `
            <p style="color:red">
                ❌ ${err.message}
            </p>
        `;
    }
}

/* =========================
   test en continue
========================= */

function afficherResultat(data) {

    const output = document.getElementById("output");
    document.getElementById("output")?.replaceChildren(); //efface le resultat au clique sur stop

    if (!output) return;

    let html = "<h3>Résultats</h3>";

    if (!data.values) {
        output.innerHTML = `<p>OK</p>`;
        return;
    }

    for (const [nom, valeur] of Object.entries(data.values)) {

        html += `<div><strong>${nom}</strong> : `;

        if (typeof valeur === "object") {

            html += Object.entries(valeur)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" | ");

        } else {
            html += valeur;
        }

        html += `</div>`;
    }

    output.innerHTML = html;
}

function startTest(id, refresh) {

    refresh = Number(refresh);
    currentModuleId = id;

    stopTest();

    if (!refresh || refresh <= 0) return;

    interval = setInterval(async () => {

        try {
            
            if (id !== currentModuleId) {
                stopTest();
                return;
            }

            const res = await fetch(`/api/test/${id}`, {
                method: "POST"
            });

            const data = await res.json();

            const output = document.getElementById("output");

            if (!output) {
                stopTest();
                return;
            }

            afficherResultat(data);

        } catch (err) {
            console.error(err);
        }

    }, refresh);
}

function stopTest() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    document.getElementById("output")?.replaceChildren(); //efface le resultat au clique sur stop
}


/* =========================
   LANCEMENT APP
========================= */

document.addEventListener("click", (e) => {
    
    const guide = e.target.closest(".welcome-card");

    if (guide) {
        openModule("avant-de-commencer");
        return;
    }
    
    const btnStart = e.target.closest(".btn-start");
    if (btnStart) {
        console.log("START DETECTE");
        startTest(
            btnStart.dataset.id,
            Number(btnStart.dataset.refresh)
        );

        return;
    }

    const btnStop = e.target.closest(".btn-stop");
    if (btnStop) {
        stopTest();
        return;
    }

    const btnTester = e.target.closest(".btn-tester");
    if (btnTester) {
        testerModule(btnTester.dataset.id);
        return;
    }

    const card = e.target.closest(".card");
    if (card && card.dataset.id) {
        openModule(card.dataset.id);
    }
});

init();