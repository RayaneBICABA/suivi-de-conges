document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-link");
  const sections = document.querySelectorAll("#dashboard, #manageLeaves, #addAgent, #priseCongeSection");

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      // Récupérer la cible
      const targetId = link.getAttribute("data-target");

      // Masquer toutes les sections
      sections.forEach(sec => sec.classList.add("hidden"));

      // Afficher la section choisie
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
        
        // Si on navigue vers "manageLeaves", réinitialiser l'état
        if (targetId === "manageLeaves") {
          // Réinitialiser les champs de vérification
          const refNumberInput = document.getElementById("refNumber");
          const yearInput = document.getElementById("year");
          const resultDiv = document.getElementById("result");
          const retourBtn = document.getElementById("retourBtn");
          
          if (refNumberInput) refNumberInput.value = "";
          if (yearInput) yearInput.value = "2024";
          if (resultDiv) resultDiv.innerHTML = "";
          if (retourBtn) retourBtn.classList.add("hidden");
        }
      }
    });
  });

  // Afficher par défaut "Tableau de bord"
  const dashboard = document.getElementById("dashboard");
  if (dashboard) {
    dashboard.classList.remove("hidden");
  }

  // Gestion de l'ajout d'agent
  const addAgentBtn = document.getElementById("addAgentBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const agentNomInput = document.getElementById("agentNom");
  const agentPrenomInput = document.getElementById("agentPrenom");
  const agentFonctionInput = document.getElementById("agentFonction");

  function clearAgentForm() {
    if (agentNomInput) agentNomInput.value = "";
    if (agentPrenomInput) agentPrenomInput.value = "";
    if (agentFonctionInput) agentFonctionInput.value = "";
  }

  if (addAgentBtn) {
    addAgentBtn.addEventListener("click", async () => {
      const nom = agentNomInput?.value.trim();
      const prenom = agentPrenomInput?.value.trim();
      const fonction = agentFonctionInput?.value.trim();

      if (!nom || !prenom || !fonction) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      const agentData = { nom, prenom, fonction };

      try {
        const response = await fetch("http://localhost:8080/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agentData),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Agent ajouté avec succès ! Matricule: ${data.matricule}`);
          clearAgentForm();
        } else {
          const message = data.message || "Erreur lors de l'ajout de l'agent";
          alert(`Erreur: ${message}`);
        }
      } catch (error) {
        alert(`Erreur de connexion: ${error.message}`);
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", clearAgentForm);
  }
});