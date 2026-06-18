let modulesData = [];
marked.use({ breaks: true });
let interval = null;

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
    console.log(module);

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

        ${module.test.refresh > 0 ? `

            <button class="btn-start"
                data-id="${escapeHtml(module.id)}"
                data-refresh="${module.refresh}">
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

        `
    }`;
}

/* =========================
   RETOUR ACCUEIL
========================= */

function goHome() {

    stopTest();
    renderHome(modulesData);
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

    if (!output) {
        stopTest(); // 🔥 STOP COMPLET
        return;
    }

    let html = "<h3>Résultats</h3>";

    if (!data.values) {
        output.innerHTML = `
            <p>✅ ${data.message || "Test terminé"}</p>
        `;
        return;
    }

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
}

function startTest(id, refresh) {

    stopTest(); // OK

    if (!refresh || refresh <= 0) return;

    interval = setInterval(async () => {

        const output = document.getElementById("output");
        if (!output) {
            stopTest();
            return;
        }

        try {
            const res = await fetch(`/api/test/${id}`, {
                method: "POST"
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.erreur);

            afficherResultat(data);

        } catch (err) {

            stopTest(); // 🔥 important aussi ici

            const output = document.getElementById("output");
            if (output) {
                output.innerHTML = `
                    <p style="color:red">❌ ${err.message}</p>
                `;
            }
        }

    }, refresh);
}

function stopTest() {

    if (interval) {

        clearInterval(interval);
        interval = null;
    }
}


/* =========================
   LANCEMENT APP
========================= */

document.addEventListener("click", (e) => {
    
    const btnStart = e.target.closest(".btn-start");
    if (btnStart) {
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