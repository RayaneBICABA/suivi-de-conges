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
// Variables DOM pour ajout d'agent
// ==========================
const agentNomInput = document.getElementById("agentNom");
const agentPrenomInput = document.getElementById("agentPrenom");
const agentMatriculeInput = document.getElementById("agentMatricule");
const agentFonctionInput = document.getElementById("agentFonction");
const addAgentBtn = document.getElementById("addAgentBtn");
const cancelBtn = document.getElementById("cancelBtn");
const agentCentreSelect = document.getElementById("agentCentre");


// ==========================
// Variables de contrôle
// ==========================
let isSubmitting = false; // Empêcher les soumissions multiples

// ==========================
// Fonctions utilitaires
// ==========================
function clearAgentForm() {
  if (agentNomInput) agentNomInput.value = "";
  if (agentPrenomInput) agentPrenomInput.value = "";
  if (agentMatriculeInput) agentMatriculeInput.value = "";
  if (agentFonctionInput) agentFonctionInput.value = "";
  if (agentCentreSelect) agentCentreSelect.value = "";
}

function showError(message) {
  showMessage(`${message}`,"error");
}

function showSuccess(message) {
  showMessage(`${message}`,"success");
}

// ==========================
// Validation des champs
// ==========================
function validateForm() {
  const nom = agentNomInput?.value.trim();
  const prenom = agentPrenomInput?.value.trim();
  const matricule = agentMatriculeInput?.value.trim();
  const fonction = agentFonctionInput?.value.trim();
  const centre = agentCentreSelect?.value.trim();

  if (!nom || !prenom || !matricule || !fonction || !centre) {
    showMessage("Veuillez remplir tous les champs obligatoires","info");
    return false;
  }

  // Validation format matricule (optionnel)
  if (matricule.length < 3) {
    showMessage("Le matricule doit contenir au moins 3 caractères","info");
    agentMatriculeInput?.focus();
    return false;
  }

  return true;
}

// ==========================
// Ajout d'un agent
// ==========================
async function ajouterAgent() {
  // Empêcher les soumissions multiples
  if (isSubmitting) {
    return;
  }

  // Validation des champs
  if (!validateForm()) {
    return;
  }

 const agentData = {
  matricule: agentMatriculeInput.value.trim().toUpperCase(),
  nom: agentNomInput.value.trim(),
  prenom: agentPrenomInput.value.trim(),
  fonction: agentFonctionInput.value.trim(),
  code:  parseInt(agentCentreSelect.value.trim(), 10)
};


  try {
    // Marquer comme en cours de soumission
    isSubmitting = true;
    
    // Désactiver le bouton pendant l'envoi
    addAgentBtn.disabled = true;
    addAgentBtn.textContent = "Ajout en cours...";

    const response = await fetch(`${apiUrl}/agent`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(agentData),
    });

    // Gérer les erreurs HTTP
    if (!response.ok) {
      let errorMessage = "Erreur lors de l'ajout de l'agent";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Si la réponse n'est pas en JSON, utiliser le message par défaut
        if (response.status === 415) {
          errorMessage = "Format de données non supporté";
        } else if (response.status === 400) {
          errorMessage = "Données invalides";
        } else if (response.status === 409) {
          errorMessage = "Le matricule existe déjà";
        } else {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Récupérer le libellé du centre sélectionné pour l'affichage
    const selectedOption = agentCentreSelect.options[agentCentreSelect.selectedIndex];
    const libelleCentre = selectedOption ? selectedOption.textContent : '';

    // Succès
    showSuccess(`Agent enregistré avec succès !\nMatricule: ${data.matricule}\nNom: ${data.prenom} ${data.nom}\nCentre: ${libelleCentre}`);
    clearAgentForm();

  } catch (error) {
    // Erreur de connexion ou autre
    console.error("Erreur lors de l'ajout de l'agent:", error);
    showError(error.message || "Erreur de connexion au serveur");

  } finally {
    // Réactiver le bouton et réinitialiser l'état
    isSubmitting = false;
    addAgentBtn.disabled = false;
    addAgentBtn.textContent = "Ajouter";
  }
}


// Charger la liste des centres
async function chargerCentres() {
  try {
    const response = await fetch(`${apiUrl}/centre`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des centres (${response.status})`);
    }

    const centres = await response.json();

    if (!Array.isArray(centres)) {
      throw new Error("Format de réponse invalide pour les centres");
    }

    if (agentCentreSelect) {
      agentCentreSelect.innerHTML = '<option value="">Sélectionnez un centre</option>';

      centres.forEach(centre => {
        const option = document.createElement("option");
        option.value = centre.code; 
        option.textContent = centre.libelleCentre;
        agentCentreSelect.appendChild(option);
      });

      showMessage(`${centres.length} centre(s) chargé(s)`, "success");
    }

  } catch (error) {
    console.error("Erreur chargement centres:", error);
    showError("Impossible de charger la liste des centres");

    if (agentCentreSelect) {
      agentCentreSelect.innerHTML = '<option value="">Erreur de chargement des centres</option>';
    }
  }
}



// ==========================
// Event listeners - Attendre que le DOM soit chargé
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  // Charger la liste des centres au démarrage
  chargerCentres();

  if (addAgentBtn) {
    addAgentBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Empêcher tout comportement par défaut
      ajouterAgent();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearAgentForm();
      showSuccess("Formulaire réinitialisé");
    });
  }

  // ==========================
  // Validation en temps réel
  // ==========================
  if (agentMatriculeInput) {
    agentMatriculeInput.addEventListener("input", (e) => {
      // Convertir automatiquement en majuscules
      e.target.value = e.target.value.toUpperCase();
      
      // Supprimer les caractères spéciaux (optionnel)
      e.target.value = e.target.value.replace(/[^A-Z0-9]/g, '');
    });
  }

  // Empêcher les caractères numériques dans nom et prénom
  [agentNomInput, agentPrenomInput].forEach(input => {
    if (input) {
      input.addEventListener("input", (e) => {
        // Supprimer les chiffres et caractères spéciaux
        e.target.value = e.target.value.replace(/[0-9]/g, '');
        
        // Capitaliser la première lettre de chaque mot
        e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
      });
    }
  });

  // ==========================
  // Soumission avec Enter
  // ==========================
  [agentNomInput, agentPrenomInput, agentMatriculeInput, agentFonctionInput].forEach(input => {
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          ajouterAgent();
        }
      });
    }
  });

  // Ajouter le select centre pour la soumission avec Enter
  if (agentCentreSelect) {
    agentCentreSelect.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        ajouterAgent();
      }
    });
  }
});