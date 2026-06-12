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
        verifierNouveauxModules();
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

async function testerModule(id) {

    const output = document.getElementById("output");

    if (!output) return;

    output.innerHTML = `
        <p>🧪 Test en cours...</p>
    `;

    try {

        const res = await fetch(`/api/test/${id}`, {
            method: "POST"
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.erreur);
        }

        let html = "<h3>Résultats</h3>";

        for (const [nom, mesure] of Object.entries(data.values)) {

            html += `
                <p>
                <strong>${nom}</strong> :
                ${mesure.value}
                ${mesure.unit ?? ""}
                </p>
            `;
        }

        output.innerHTML = html;

    } catch (err) {

        output.innerHTML = `
            <p style="color:red">
                ❌ ${err.message}
            </p>
        `;
    }
}

async function verifierNouveauxModules() {
    try {
        const res = await fetch("/api/store");
        if (!res.ok) return; // silencieux si pas de réseau
        const data = await res.json();

        const nouveaux = data.catalogue.filter(m => !m.installe);
        if (nouveaux.length > 0) {
            afficherNotifStore(nouveaux.length);
        }
    } catch {
        // Pas de réseau → on ignore silencieusement
    }
}

function afficherNotifStore(count) {

    let btn = document.querySelector(".btn-store");

    if (count === 0) {
        if (btn) btn.remove();
        return;
    }

    if (!btn) {

        const header = document.querySelector("header");

        btn = document.createElement("button");

        btn.className = "btn-store";
        btn.onclick = ouvrirStore;

        header.appendChild(btn);
    }

    btn.textContent = `📦 ${count} module(s) disponible(s)`;
}

async function ouvrirStore() {
    const app = document.getElementById("app");
    app.innerHTML = `<p>Chargement du catalogue...</p>`;

    try {
        const res  = await fetch("/api/store");
        const data = await res.json();
        const nouveaux = data.catalogue.filter(m => !m.installe);

        app.innerHTML = `
            <button onclick="goHome()">← Retour</button>
            <h2>📦 Modules disponibles (${nouveaux.length})</h2>
            <div class="grid">
                ${nouveaux.map(m => `
                    <div class="card">
                        <h3>${escapeHtml(m.nom || m.id)}</h3>
                        <p>${escapeHtml(m.description || "")}</p>
                        <button class="btn-install" data-id="${escapeHtml(m.id)}">
                            ⬇️ Installer
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (err) {
        app.innerHTML = `<p class="erreur">❌ ${err.message}</p>`;
    }
}

async function installerModule(id) {

    const btn = document.querySelector(`[data-id="${id}"].btn-install`);

    if (btn) btn.textContent = "⏳ Installation...";

    try {

        const res = await fetch(`/api/store/install/${id}`, {
            method: "POST"
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.erreur);

        if (btn) btn.textContent = "✅ Installé";

        // 🔥 IMPORTANT FIX
        const r = await fetch("/api/modules");
        modulesData = await r.json();
        
        renderHome(modulesData);
        await ouvrirStore();
        await verifierNouveauxModules();

    } catch (err) {

        if (btn) btn.textContent = "❌ Erreur";
        alert(err.message);
    }
}

let interval;

function startTest(id) {

    interval = setInterval(async () => {

        const res = await fetch(`/api/test/${id}`);
        const data = await res.json();

        afficher(data);

    }, 2000);
}

function stopTest() {
    clearInterval(interval);
}


/* =========================
   LANCEMENT APP
========================= */

document.addEventListener("click", (e) => {

    const btnInstall = e.target.closest(".btn-install");
    if (btnInstall) {
        installerModule(btnInstall.dataset.id);
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