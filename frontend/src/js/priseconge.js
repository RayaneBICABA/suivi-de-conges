// --- Récupérer la ref passée en query param ---
const params = new URLSearchParams(window.location.search);
const refNumber = params.get("ref");
const congeRef = refNumber + "/DRH/" + new Date().getFullYear();

const apiUrl = `http://localhost:8080/agent/byConge?ref=${congeRef}`;

// --- Variables DOM ---
const matriculeEl = document.getElementById("matricule");
const nomEl = document.getElementById("nom");
const prenomEl = document.getElementById("prenom");
const fonctionEl = document.getElementById("fonction");

const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const numDaysEl = document.getElementById("numDays");

const addCongeBtn = document.getElementById("addCongeBtn");

// --- Fetch agent ---
async function fetchAgent() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Agent non trouvé");

    const agent = await response.json();

    matriculeEl.textContent = agent.matricule;
    nomEl.textContent = agent.nom;
    prenomEl.textContent = agent.prenom;
    fonctionEl.textContent = agent.fonction;

  } catch (error) {
    alert(error.message);
  }
}

// --- Calcul nombre de jours ---
function calculateDays() {
  const start = new Date(startDateEl.value);
  const end = new Date(endDateEl.value);
  if (start && end && end >= start) {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    numDaysEl.textContent = diffDays;
  } else {
    numDaysEl.textContent = 0;
  }
}

startDateEl.addEventListener("change", calculateDays);
endDateEl.addEventListener("change", calculateDays);

addCongeBtn.addEventListener("click", () => {
  alert(`Ajouter congé pour ${matriculeEl.textContent}du ${startDateEl.value} au ${endDateEl.value} (${numDaysEl.textContent} jours)`);
  // Ici tu peux faire un fetch POST vers ton backend
});

fetchAgent();
