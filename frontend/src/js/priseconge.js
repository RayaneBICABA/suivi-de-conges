
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
      alert("❌ Éléments manquants dans le DOM");
      return;
    }

    const matricule = matriculeEl.textContent.trim();
    const dateDebut = pcStartDateEl.value;
    const dateFin = pcEndDateEl.value;
    const jours = parseInt(pcNumDaysEl.textContent, 10);
    const joursRestants = parseInt(joursRestantsEl.textContent, 10);

    if (!currentPriseCongeRef) {
      alert("⚠️ Référence de congé invalide.");
      return;
    }
    if (!matricule || matricule === "--") {
      alert("⚠️ Matricule agent introuvable.");
      return;
    }
    if (!dateDebut || !dateFin) {
      alert("⚠️ Veuillez choisir la période.");
      return;
    }
    if (!jours || jours <= 0) {
      alert("⚠️ Nombre de jours invalide.");
      return;
    }

    // Vérification du solde restant
    if (jours > joursRestants) {
      alert(`⚠️ Vous demandez ${jours} jours alors qu'il ne reste que ${joursRestants} jours.`);
      return;
    }

    const payload = { 
      matricule, 
      congeRef: currentPriseCongeRef, 
      dateDebut, 
      dateFin, 
      jours 
    };

    try {
      const response = await fetch(`${apiUrl}}/suivi-conge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Erreur lors de l'ajout du congé";
        throw new Error(`❌ ${message}`);
      }

      alert(`✅ Congé ajouté avec succès (ID: ${data.id})`);

      // Réinitialiser les champs
      pcStartDateEl.value = "";
      pcEndDateEl.value = "";
      pcNumDaysEl.textContent = "0";

      // Rafraîchir le solde de jours restants
      await fetchJoursRestants(currentPriseCongeRef);

    } catch (error) {
      alert(error.message);
    }
  });
}