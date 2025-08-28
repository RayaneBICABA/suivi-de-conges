import {apiUrl} from "./config.js";


function showMessage(message, type = "info") {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const container = document.createElement("div");
  container.className = `${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`;
  container.textContent = message;

  document.body.appendChild(container);

  // Disparaît après 4s
  setTimeout(() => {
    container.remove();
  }, 4000);
}


// ==========================
// Variables DOM pour prise de congé
// ==========================
const pcStartDateEl = document.getElementById("pcStartDate");
const pcEndDateEl = document.getElementById("pcEndDate");
const pcNumDaysEl = document.getElementById("pcNumDays");
const pcAddCongeBtn = document.getElementById("pcAddCongeBtn");

// Variables pour récupérer la référence de congé actuelle
let currentPriseCongeRef = "";

// ==========================
// Fonction pour définir la référence courante
// ==========================
function setPriseCongeRef(congeRef) {
  currentPriseCongeRef = congeRef;
}

// ==========================
// Calcul nombre de jours (inclusif)
// ==========================
function calculateDays() {
  if (!pcStartDateEl || !pcEndDateEl || !pcNumDaysEl) return;
  
  const start = new Date(pcStartDateEl.value);
  const end = new Date(pcEndDateEl.value);
  
  if (start.toString() !== "Invalid Date" && end.toString() !== "Invalid Date" && end >= start) {
    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    pcNumDaysEl.textContent = diffDays;
  } else {
    pcNumDaysEl.textContent = 0;
  }
}

// ==========================
// Event listeners pour calcul des jours
// ==========================
if (pcStartDateEl && pcEndDateEl) {
  pcStartDateEl.addEventListener("change", calculateDays);
  pcEndDateEl.addEventListener("change", calculateDays);
}

// ==========================
// Fetch jours restants
// ==========================
async function fetchJoursRestants(congeRef) {
  try {
    const url = `${apiUrl}/suivi-conge/jours-restants?reference=${encodeURIComponent(congeRef)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Impossible de récupérer les jours restants");
    }

    const joursRestantsEl = document.getElementById("pcJoursRestants");
    if (joursRestantsEl) {
      joursRestantsEl.textContent = data.joursRestants ?? "--";
    }

  } catch (error) {
    console.error("Erreur fetch jours restants:", error);
    const joursRestantsEl = document.getElementById("pcJoursRestants");
    if (joursRestantsEl) {
      joursRestantsEl.textContent = "--";
    }
  }
}

// ==========================
// Ajouter un congé (suivi de congé)
// ==========================
if (pcAddCongeBtn) {
  pcAddCongeBtn.addEventListener("click", async () => {
    const matriculeEl = document.getElementById("pcMatricule");
    const joursRestantsEl = document.getElementById("pcJoursRestants");
    
    if (!matriculeEl || !joursRestantsEl) {
      showMessage("❌ Éléments manquants dans le DOM","error");
      return;
    }

    const matricule = matriculeEl.textContent.trim();
    const dateDebut = pcStartDateEl.value;
    const dateFin = pcEndDateEl.value;
    const jours = parseInt(pcNumDaysEl.textContent, 10);
    const joursRestants = parseInt(joursRestantsEl.textContent, 10);

    if (!currentPriseCongeRef) {
     showMessage("⚠️ Référence de congé invalide.","info");
      return;
    }
    if (!matricule || matricule === "--") {
      showMessage("⚠️ Matricule agent introuvable.","error");
      return;
    }
    if (!dateDebut || !dateFin) {
      showMessage("⚠️ Veuillez choisir la période.","error");
      return;
    }
    if (!jours || jours <= 0) {
      showMessage("⚠️ Nombre de jours invalide.","error");
      return;
    }

    // Vérification du solde restant
    if (jours > joursRestants) {
      showMessage(`⚠️ Vous demandez ${jours} jours alors qu'il ne reste que ${joursRestants} jours.`,"error");
      return;
    }

    const payload = { 
      matricule, 
      congeRef: currentPriseCongeRef, 
      dateDebut, 
      dateFin, 
      jours 
    };
fetch
    try {
      const response = await fetch(`${apiUrl}/suivi-conge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Erreur lors de l'ajout du congé";
        throw new Error(`❌ ${message}`);
      }

      showMessage(`✅ Congé ajouté avec succès (ID: ${data.id})`,"success");

      // Réinitialiser les champs
      pcStartDateEl.value = "";
      pcEndDateEl.value = "";
      pcNumDaysEl.textContent = "0";

      // Rafraîchir le solde de jours restants
      await fetchJoursRestants(currentPriseCongeRef);

    } catch (error) {
      showMessage("error.message"+error.message,"error");
    }
  });
}

export { setPriseCongeRef };
