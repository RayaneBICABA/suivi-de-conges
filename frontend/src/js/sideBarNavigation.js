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
        
        // Si on navigue vers "addAgent", réinitialiser le formulaire
        if (targetId === "addAgent") {
          const agentNomInput = document.getElementById("agentNom");
          const agentPrenomInput = document.getElementById("agentPrenom");
          const agentMatriculeInput = document.getElementById("agentMatricule");
          const agentFonctionInput = document.getElementById("agentFonction");
          
          if (agentNomInput) agentNomInput.value = "";
          if (agentPrenomInput) agentPrenomInput.value = "";
          if (agentMatriculeInput) agentMatriculeInput.value = "";
          if (agentFonctionInput) agentFonctionInput.value = "";
        }
      }
    });
  });

  // Afficher par défaut "Tableau de bord"
  const dashboard = document.getElementById("dashboard");
  if (dashboard) {
    dashboard.classList.remove("hidden");
  }

  // SUPPRIMÉ : Toute la logique d'ajout d'agent a été retirée
  // Elle est maintenant gérée uniquement par ajouterAgent.js
});