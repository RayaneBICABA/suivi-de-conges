const apiUrl = "http://192.168.40.64:8080";


// ==========================
// Éléments du DOM
// ==========================
const refNumberInput = document.getElementById("refNumber");
const yearInput = document.getElementById("year");
const checkBtn = document.getElementById("checkBtn");
const resultDiv = document.getElementById("result");
const retourBtn = document.getElementById("retourBtn");

// Popup elements
const popupOverlay = document.getElementById("popupCongeOverlay");
const popupCloseBtn = document.getElementById("popupCloseBtn");
const popupDecisionNumberInput = document.getElementById("popupDecisionNumber");
const popupNomInput = document.getElementById("popupNom");
const popupPrenomInput = document.getElementById("popupPrenom");
const popupMatriculeInput = document.getElementById("popupMatricule");
const popupJoursCongesInput = document.getElementById("popupJoursConges");
const popupConfirmerBtn = document.getElementById("popupConfirmerBtn");
const popupAnnulerBtn = document.getElementById("popupAnnulerBtn");

// Sections
const manageLeaves = document.getElementById("manageLeaves");
const priseCongeSection = document.getElementById("priseCongeSection");

// ==========================
// Variables globales
// ==========================
let currentRefNumber = "";
let currentYear = "";
let currentCongeRef = "";

// ==========================
// Fonctions Popup
// ==========================
function showPopup() {
  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("flex");
  currentCongeRef = `${currentRefNumber}/DRH/${currentYear}`;
  popupDecisionNumberInput.value = currentCongeRef;
}

function hidePopup() {
  popupOverlay.classList.add("hidden");
  popupOverlay.classList.remove("flex");
}

function clearPopupFields() {
  popupMatriculeInput.value = "";
  popupJoursCongesInput.value = "0";
  popupNomInput.value = "";
  popupPrenomInput.value = "";
}

// ==========================
// Navigation functions
// ==========================
function showManageLeaves() {
  // Masquer toutes les sections
  document.querySelectorAll("#dashboard, #addAgent, #priseCongeSection").forEach(sec => sec.classList.add("hidden"));
  // Afficher la section gestion des congés
  manageLeaves.classList.remove("hidden");
  // Réinitialiser les champs
  refNumberInput.value = "";
  yearInput.value = "2025";
  resultDiv.innerHTML = "";
  retourBtn.classList.add("hidden");
}

function showPriseConge(congeRef) {
  // Masquer toutes les sections
  document.querySelectorAll("#dashboard, #manageLeaves, #addAgent").forEach(sec => sec.classList.add("hidden"));
  // Afficher la section prise de congé
  priseCongeSection.classList.remove("hidden");
  // Charger les données
  afficherInfosConge(congeRef);
}

// ==========================
// Récupérer agent par matricule
// ==========================
async function fetchAgentByMatricule(matricule) {
  if (!matricule.trim()) {
    popupNomInput.value = "";
    popupPrenomInput.value = "";
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/agent/nomPrenom?matricule=${encodeURIComponent(matricule)}`);
    if (response.ok) {
      const agentData = await response.json();
      popupNomInput.value = agentData.nom || "";
      popupPrenomInput.value = agentData.prenom || "";
    } else {
      popupNomInput.value = "";
      popupPrenomInput.value = "";
    }
  } catch (error) {
    popupNomInput.value = "";
    popupPrenomInput.value = "";
    console.error(error);
  }
}

// ==========================
// Injecter les infos dans priseCongeSection
// ==========================
async function afficherInfosConge(congeRef) {
  try {
    // Récupérer l'agent et les jours attribués
    const agentResponse = await fetch(`${apiUrl}/agent/byConge?ref=${encodeURIComponent(congeRef)}`);
    if (!agentResponse.ok) throw new Error("Agent non trouvé");

    const agentData = await agentResponse.json();
    const agent = agentData.agent;
    const joursAttribues = agentData.jours ?? 0;

    // Récupérer les jours restants
    const joursRestantsResponse = await fetch(`${apiUrl}/suivi-conge/jours-restants?reference=${encodeURIComponent(congeRef)}`);
    const joursRestantsData = await joursRestantsResponse.json();
    const joursRestants = joursRestantsData.joursRestants ?? 0;

    // Injecter les données dans le DOM
    document.getElementById("pcRefConge").textContent = congeRef;
    document.getElementById("pcMatricule").textContent = agent.matricule ?? "-";
    document.getElementById("pcNom").textContent = agent.nom ?? "-";
    document.getElementById("pcPrenom").textContent = agent.prenom ?? "-";
    document.getElementById("pcFonction").textContent = agent.fonction ?? "-";
    document.getElementById("pcJoursAttribues").textContent = joursAttribues;
    document.getElementById("pcJoursRestants").textContent = joursRestants;

    // Définir la référence courante pour priseconge.js
    if (typeof setPriseCongeRef === 'function') {
      setPriseCongeRef(congeRef);
    }

  } catch (err) {
    console.error("Erreur récupération infos congé:", err);
    document.getElementById("pcRefConge").textContent = congeRef;
    document.getElementById("pcMatricule").textContent = "-";
    document.getElementById("pcNom").textContent = "-";
    document.getElementById("pcPrenom").textContent = "-";
    document.getElementById("pcFonction").textContent = "-";
    document.getElementById("pcJoursAttribues").textContent = "0";
    document.getElementById("pcJoursRestants").textContent = "0";
    
    // Définir la référence même en cas d'erreur
    if (typeof setPriseCongeRef === 'function') {
      setPriseCongeRef(congeRef);
    }
  }
}

// ==========================
// Vérifier référence et afficher infos
// ==========================
checkBtn.addEventListener("click", async () => {
  const refNumber = refNumberInput.value.trim();
  const year = yearInput.value.trim();
  
  if (!refNumber || !year) {
    resultDiv.innerHTML = `<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;
    return;
  }

  currentRefNumber = refNumber;
  currentYear = year;
  const congeRef = `${refNumber}/DRH/${year}`;

  try {
    const response = await fetch(`${apiUrl}/conge/checkRef?refNumber=${refNumber}&year=${year}`);
    const text = await response.text();

    if (response.ok) {
      resultDiv.innerHTML = `<span class="text-green-600">Référence trouvée : <b>${congeRef}</b></span>`;
      // Redirige vers PriseConge après un délai
      setTimeout(() => showPriseConge(congeRef), 500);
    } else {
      resultDiv.innerHTML = `<span class="text-red-600">${text}</span>`;
      // Afficher le popup pour créer le congé
      setTimeout(showPopup, 300);
    }
  } catch (error) {
    resultDiv.innerHTML = `<span class="text-red-600">Erreur: ${error.message}</span>`;
  }
});

// ==========================
// Gestion du bouton retour
// ==========================
retourBtn.addEventListener("click", showManageLeaves);

// Bouton retour dans priseCongeSection
document.getElementById("retourPriseCongeBtn").addEventListener("click", showManageLeaves);

// ==========================
// Gestion de la popup
// ==========================
popupCloseBtn.addEventListener("click", hidePopup);
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) hidePopup();
});

popupAnnulerBtn.addEventListener("click", () => {
  clearPopupFields();
  hidePopup();
});

// ==========================
// Confirmer création de congé
// ==========================
popupConfirmerBtn.addEventListener("click", async () => {
  const matricule = popupMatriculeInput.value.trim();
  const jours = parseInt(popupJoursCongesInput.value) || 0;

  if (!matricule) return alert("Veuillez saisir un matricule.");
  if (jours <= 0) return alert("Nombre de jours invalide.");

  const congeData = {
    reference: currentCongeRef,
    matriculeAgent: matricule,
    jours: jours,
  };

  try {
    const response = await fetch("${apiUrl}/conge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(congeData),
    });

    const data = await response.json();
    
    if (response.ok) {
      hidePopup();
      clearPopupFields();
      resultDiv.innerHTML = `<span class="text-green-600">Congé créé avec succès !</span>`;
      // Redirection automatique vers prise de congé
      setTimeout(() => showPriseConge(currentCongeRef), 500);
    } else {
      const message = data.message || "Erreur lors de la création du congé";
      alert(`❌ ${message}`);
    }
  } catch (error) {
    alert(`Erreur de connexion : ${error.message}`);
  }
});

// ==========================
// Debouncing pour matricule dans popup
// ==========================
popupMatriculeInput.addEventListener("input", (e) => {
  clearTimeout(popupMatriculeInput.searchTimeout);
  popupMatriculeInput.searchTimeout = setTimeout(() => {
    fetchAgentByMatricule(e.target.value.trim());
  }, 500);
});

popupMatriculeInput.addEventListener("blur", () =>
  fetchAgentByMatricule(popupMatriculeInput.value.trim())
);