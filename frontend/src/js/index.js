// Éléments du DOM
const refNumberInput = document.getElementById("refNumber");
const yearInput = document.getElementById("year");
const checkBtn = document.getElementById("checkBtn");
const resultDiv = document.getElementById("result");
const overlay = document.getElementById("overlay");
const closePopupBtn = document.getElementById("closePopup");
const decisionNumberInput = document.getElementById("decisionNumber");
const nomInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const matriculeInput = document.getElementById("matricule");
const joursCongesInput = document.getElementById("joursConges");
const confirmerBtn = document.getElementById("confirmerBtn");
const annulerBtn = document.getElementById("annulerBtn");

// Variables globales pour stocker les données
let currentRefNumber = "";
let currentYear = "";
let currentCongeRef = "";

// --- Section navigation ---
const btnDashboard = document.getElementById("btnDashboard");
const btnManage = document.getElementById("btnManage");
const btnAddAgent = document.getElementById("btnAddAgent");

const dashboardSection = document.getElementById("dashboardSection");
const manageSection = document.getElementById("manageSection");
const addAgentSection = document.getElementById("addAgentSection");

const sections = [dashboardSection, manageSection, addAgentSection].filter(Boolean);

function animateShow(sectionEl) {
    if (!sectionEl) return;
    sectionEl.classList.remove("hidden");
    sectionEl.classList.add("opacity-0", "translate-y-2");
    // Ensure transition classes are present
    sectionEl.classList.add("transition-all", "duration-300");
    requestAnimationFrame(() => {
        sectionEl.classList.remove("opacity-0", "translate-y-2");
        sectionEl.classList.add("opacity-100", "translate-y-0");
    });
}

function animateHide(sectionEl, onHidden) {
    if (!sectionEl) {
        if (typeof onHidden === "function") onHidden();
        return;
    }
    // Ensure transition classes are present
    sectionEl.classList.add("transition-all", "duration-300");
    sectionEl.classList.remove("opacity-100", "translate-y-0");
    sectionEl.classList.add("opacity-0", "translate-y-2");

    const handleEnd = (e) => {
        if (e.target !== sectionEl) return; // ignore bubbled events from children
        sectionEl.removeEventListener("transitionend", handleEnd);
        sectionEl.classList.add("hidden");
        if (typeof onHidden === "function") onHidden();
    };
    sectionEl.addEventListener("transitionend", handleEnd);
}

function getVisibleSection() {
    return sections.find((s) => s && !s.classList.contains("hidden"));
}

function switchSection(targetSection) {
    const currentlyVisible = getVisibleSection();
    if (currentlyVisible === targetSection) return;

    if (currentlyVisible) {
        animateHide(currentlyVisible, () => animateShow(targetSection));
    } else {
        animateShow(targetSection);
    }
}

btnDashboard?.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(dashboardSection);
});

btnManage?.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(manageSection);
});

btnAddAgent?.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(addAgentSection);
});

// Default: show dashboard on first load
if (dashboardSection) {
    // Hide all others hard to avoid flash
    sections.forEach((s) => {
        if (s !== dashboardSection) s.classList.add("hidden");
        s.classList.add("opacity-100", "translate-y-0");
    });
    animateShow(dashboardSection);
}

// --- Popup ---
function showPopup() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    currentCongeRef = `${currentRefNumber}/DRH/${currentYear}`;
    decisionNumberInput.value = currentCongeRef;
}

function hidePopup() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
}

function clearPopupFields() {
    matriculeInput.value = "";
    joursCongesInput.value = "0";
    nomInput.value = "";
    prenomInput.value = "";
}

// --- Récupérer agent par matricule ---
async function fetchAgentByMatricule(matricule) {
    if (!matricule.trim()) {
        nomInput.value = "";
        prenomInput.value = "";
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/agent/nomPrenom?matricule=${encodeURIComponent(matricule)}`);
        if (response.ok) {
            const agentData = await response.json();
            nomInput.value = agentData.nom || "";
            prenomInput.value = agentData.prenom || "";
        } else {
            nomInput.value = "";
            prenomInput.value = "";
        }
    } catch (error) {
        nomInput.value = "";
        prenomInput.value = "";
        console.error(error);
    }
}

// --- Vérifier référence ---
checkBtn.addEventListener("click", async () => {
    const refNumber = refNumberInput.value;
    const year = yearInput.value;
    if (!refNumber || !year) {
        resultDiv.innerHTML = `<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;
        return;
    }
    currentRefNumber = refNumber;
    currentYear = year;
    try {
        const response = await fetch(`http://localhost:8080/conge/checkRef?refNumber=${refNumber}&year=${year}`);
        const text = await response.text();
        const congeRef = `${refNumber}/DRH/${year}`;
        if (response.ok) {
            resultDiv.innerHTML = `<span class="text-green-600">Référence trouvée : <b>${congeRef}</b></span>`;
            setTimeout(() => {
                window.location.href = `src/html/priseconge.html?congeRef=${encodeURIComponent(congeRef)}`;
            }, 1000);
        } else {
            resultDiv.innerHTML = `<span class="text-red-600">${text}</span>`;
            setTimeout(showPopup, 500);
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="text-red-600">Erreur: ${error.message}</span>`;
    }
});

// --- Fermeture popup ---
closePopupBtn.addEventListener("click", hidePopup);
overlay.addEventListener("click", (e) => { if (e.target === overlay) hidePopup(); });
annulerBtn.addEventListener("click", () => { clearPopupFields(); hidePopup(); });

// --- Confirmer création de congé ---
confirmerBtn.addEventListener("click", async () => {
    const matricule = matriculeInput.value.trim();
    const jours = parseInt(joursCongesInput.value) || 0;

    if (!matricule) return alert("Veuillez saisir un matricule.");
    if (jours <= 0) return alert("Nombre de jours invalide.");

    const congeData = {
        reference: currentCongeRef,
        matriculeAgent: matricule,
        jours: jours
    };

    try {
        const response = await fetch("http://localhost:8080/conge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(congeData)
        });

        const data = await response.json();

        if (response.ok) {
            hidePopup();
            resultDiv.innerHTML = `<span class="text-green-600">Congé créé avec succès ! Redirection...</span>`;
            setTimeout(() => {
                window.location.href = `src/html/priseconge.html?congeRef=${encodeURIComponent(currentCongeRef)}`;
            }, 2000);
        } else {
            const message = data.message || "Erreur lors de la création du congé";
            alert(`❌ ${message}`);
        }
    } catch (error) {
        alert(`Erreur de connexion : ${error.message}`);
    }
});

// --- Debouncing pour matricule ---
matriculeInput.addEventListener("input", (e) => {
    clearTimeout(matriculeInput.searchTimeout);
    matriculeInput.searchTimeout = setTimeout(() => {
        fetchAgentByMatricule(e.target.value.trim());
    }, 500);
});
matriculeInput.addEventListener("blur", () => fetchAgentByMatricule(matriculeInput.value.trim()));
