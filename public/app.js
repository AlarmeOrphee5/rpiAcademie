let modulesData = [];
marked.use({ breaks: true });

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
        communication: []
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
        <h2>Choisis un module</h2>

        ${renderSection("🔴 Actionneurs", grouped.actionneur)}
        ${renderSection("🔵 Capteurs", grouped.capteur)}
        ${renderSection("🟣 Communication", grouped.communication)}
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

                    <div class="card" data-id="${escapeHtml(m.id)}">

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

    const app = document.getElementById("app");

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

        <h3>Schéma</h3>

        <div class="schema">

            <img
                src="/modules/${escapeHtml(module.id)}/${escapeHtml(module.files.schema)}"
                alt="Schéma de câblage"
            >

        </div>

        <hr>

        <button class="btn-tester" data-id="${escapeHtml(module.id)}">Tester</button>
            Tester
        </button>

        <div id="output"></div>

    `;
}

/* =========================
   RETOUR ACCUEIL
========================= */

function goHome() {

    renderHome(modulesData);
}

/* =========================
   TEST MODULE
========================= */

function testerModule(id) {

    const output = document.getElementById("output");

    if (!output) return;

    output.innerHTML = `
        <p>🧪 Test du module : <b>${id}</b></p>
        <p>Simulation en cours...</p>
    `;
}

/* =========================
   LANCEMENT APP
========================= */

document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openModule(card.dataset.id);
    const btnTester = e.target.closest(".btn-tester");
    if (btnTester) testerModule(btnTester.dataset.id);
});

init();