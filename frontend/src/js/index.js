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

// Fonction pour afficher le popup
function showPopup() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    
    // Pré-remplir le numéro de décision
    currentCongeRef = `${currentRefNumber}/DRH/${currentYear}`;
    decisionNumberInput.value = currentCongeRef;
}

// Fonction pour fermer le popup
function hidePopup() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
}

// Fonction pour récupérer les informations de l'agent par matricule
async function fetchAgentByMatricule(matricule) {
    if (!matricule.trim()) {
        // Vider les champs si matricule vide
        nomInput.value = "";
        prenomInput.value = "";
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/agent/nomPrenom?matricule=${encodeURIComponent(matricule)}`);
        
        if (response.ok) {
            const agentData = await response.json();
            // Remplir automatiquement les champs nom et prénom
            nomInput.value = agentData.nom || "";
            prenomInput.value = agentData.prenom || "";
        } else {
            // Si l'agent n'est pas trouvé, vider les champs
            nomInput.value = "";
            prenomInput.value = "";
            const errorText = await response.text();
            console.log(`Agent non trouvé: ${errorText}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'agent: ${error.message}`);
        nomInput.value = "";
        prenomInput.value = "";
    }
}

// Fonction pour vider les champs du popup
function clearPopupFields() {
    matriculeInput.value = "";
    joursCongesInput.value = "0";
    nomInput.value = "";
    prenomInput.value = "";
}

// Événement pour vérifier la référence
checkBtn.addEventListener("click", async () => {
    const refNumber = refNumberInput.value;
    const year = yearInput.value;
    
    if (!refNumber || !year) {
        resultDiv.innerHTML = `<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;
        return;
    }
    
    // Stocker les valeurs actuelles
    currentRefNumber = refNumber;
    currentYear = year;
    
    try {
        const response = await fetch(`http://localhost:8080/conge/checkRef?refNumber=${refNumber}&year=${year}`);
        const text = await response.text();
        const congeRef = `${refNumber}/DRH/${year}`;
        
        if (response.ok) {
            resultDiv.innerHTML = `<span class="text-green-600">Référence trouvée : <b>${congeRef}</b></span>`;
            setTimeout(() => {
                // on passe la ref complète, encodée (car elle contient des /)
                window.location.href = `src/html/priseconge.html?congeRef=${encodeURIComponent(congeRef)}`;
            }, 1000);
        } else {
            resultDiv.innerHTML = `<span class="text-red-600">${text}</span>`;
            // Afficher le popup de création après un délai
            setTimeout(() => {
                showPopup();
            }, 500);
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="text-red-600">Erreur: ${error.message}</span>`;
    }
});

// Événements pour fermer le popup
closePopupBtn.addEventListener("click", hidePopup);

// Fermer le popup en cliquant sur l'overlay
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        hidePopup();
    }
});

// Événement pour le bouton Annuler
annulerBtn.addEventListener("click", () => {
    clearPopupFields();
    hidePopup();
});

// Événement pour le bouton Confirmer
confirmerBtn.addEventListener("click", async () => {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    const matricule = matriculeInput.value.trim();
    const joursConges = parseInt(joursCongesInput.value) || 0;
    
    // Validation des champs obligatoires
    if (!matricule) {
        alert("Veuillez saisir un matricule.");
        return;
    }
    
    if (!nom || !prenom) {
        alert("Aucun agent trouvé pour ce matricule. Veuillez vérifier le matricule saisi.");
        return;
    }
    
    try {
        // Données à envoyer au serveur
        const congeData = {
            refNumber: currentRefNumber,
            year: currentYear,
            nom: nom,
            prenom: prenom,
            matricule: matricule,
            joursConges: joursConges
        };
        
        // Appel API pour créer le congé
        const response = await fetch('http://localhost:8080/conge/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(congeData)
        });
        
        if (response.ok) {
            // Succès - rediriger vers la page de prise de congé
            const congeRef = `${currentRefNumber}/DRH/${currentYear}`;
            hidePopup();
            resultDiv.innerHTML = `<span class="text-green-600">Congé créé avec succès ! Redirection...</span>`;
            setTimeout(() => {
                window.location.href = `src/html/priseconge.html?congeRef=${encodeURIComponent(congeRef)}`;
            }, 1000);
        } else {
            const errorText = await response.text();
            alert(`Erreur lors de la création : ${errorText}`);
        }
    } catch (error) {
        alert(`Erreur de connexion : ${error.message}`);
    }
});

// Gérer l'appui sur Entrée dans les champs du formulaire principal
refNumberInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkBtn.click();
    }
});

yearInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkBtn.click();
    }
});

// Événement pour le champ matricule - recherche automatique
matriculeInput.addEventListener("input", async (e) => {
    const matricule = e.target.value.trim();
    // Attendre un peu avant de faire la requête (debouncing)
    clearTimeout(matriculeInput.searchTimeout);
    matriculeInput.searchTimeout = setTimeout(() => {
        fetchAgentByMatricule(matricule);
    }, 500);
});

// Événement pour le champ matricule - recherche immédiate sur blur
matriculeInput.addEventListener("blur", () => {
    const matricule = matriculeInput.value.trim();
    fetchAgentByMatricule(matricule);
});

// Gérer l'appui sur Entrée dans les champs du popup
[matriculeInput, joursCongesInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            confirmerBtn.click();
        }
    });
});