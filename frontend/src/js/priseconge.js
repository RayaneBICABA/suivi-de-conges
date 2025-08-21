// --- Récupérer la ref *complète* passée en query param ---
const params = new URLSearchParams(window.location.search);
const congeRef = decodeURIComponent(params.get("congeRef") || "");

const refCongeEl = document.getElementById("refConge");
refCongeEl.textContent = congeRef;

// --- Endpoints ---
const apiUrl = `http://localhost:8080/agent/byConge?ref=${encodeURIComponent(congeRef)}`;

// --- Variables DOM ---
const matriculeEl = document.getElementById("matricule");
const nomEl = document.getElementById("nom");
const prenomEl = document.getElementById("prenom");
const fonctionEl = document.getElementById("fonction");
const joursEl = document.getElementById("jours");

const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const numDaysEl = document.getElementById("numDays");
const addCongeBtn = document.getElementById("addCongeBtn");

// --- Fetch agent (attend { agent: {...}, jours: number }) ---
async function fetchAgent() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Agent non trouvé");

    const data = await response.json();
    const agent = data.agent;
    const jours = data.jours ?? (agent.conges && agent.conges.length > 0 ? agent.conges[0].jours : "--");
    


    matriculeEl.textContent = agent.matricule;
    nomEl.textContent = agent.nom;
    prenomEl.textContent = agent.prenom;
    fonctionEl.textContent = agent.fonction;
    joursEl.textContent = jours;

  } catch (error) {
    alert(error.message);
  }
}

// --- Calcul nombre de jours (inclusif) ---
function calculateDays() {
  const start = new Date(startDateEl.value);
  const end = new Date(endDateEl.value);
  if (start.toString() !== "Invalid Date" && end.toString() !== "Invalid Date" && end >= start) {
    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    numDaysEl.textContent = diffDays;
  } else {
    numDaysEl.textContent = 0;
  }
}

startDateEl.addEventListener("change", calculateDays);
endDateEl.addEventListener("change", calculateDays);

// --- POST création d’un suivi de congé (step 2) ---
addCongeBtn.addEventListener("click", async () => {
  const matricule = matriculeEl.textContent.trim();
  const dateDebut = startDateEl.value;
  const dateFin = endDateEl.value;
  const jours = parseInt(numDaysEl.textContent, 10);

  if (!congeRef) return alert("⚠️ Référence de congé invalide.");
  if (!matricule || matricule === "--") return alert("⚠️ Matricule agent introuvable.");
  if (!dateDebut || !dateFin) return alert("⚠️ Veuillez choisir la période.");
  if (!jours || jours <= 0) return alert("⚠️ Nombre de jours invalide.");

  const payload = { matricule, congeRef, dateDebut, dateFin, jours };

  try {
    const response = await fetch(`http://localhost:8080/suivi-conge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Si backend envoie {status, error, message}
      if (data.message) {
        throw new Error(`❌ ${data.message}`);
      }
      throw new Error("❌ Erreur lors de l'ajout du congé");
    }

    alert(`✅ Congé ajouté avec succès (ID: ${data.id})`);

  } catch (error) {
    alert(error.message);
  }
});


fetchAgent();
