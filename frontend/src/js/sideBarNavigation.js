document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-link");
  const sections = document.querySelectorAll(
    "#dashboard, #manageLeaves, #addAgent, #priseCongeSection"
  );

  // Fonction pour réinitialiser une section
  function resetSection(section) {
    // Réinitialiser les inputs
    const inputs = section.querySelectorAll("input");
    inputs.forEach(input => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else if (input.type === "number") {
        input.value = "";
      } else {
        input.value = "";
      }
    });

    // Réinitialiser les textarea
    const textareas = section.querySelectorAll("textarea");
    textareas.forEach(area => area.value = "");

    // Réinitialiser les select
    const selects = section.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0);

    // Réinitialiser les spans ou divs qui affichent des valeurs
    const dynamicValues = section.querySelectorAll("span, div");
    dynamicValues.forEach(el => {
      // Certains éléments ont des IDs spécifiques pour compteurs
      if (
        el.id === "pcNumDays" ||
        el.id === "pcJoursRestants" ||
        el.id === "pcJoursAttribues"
      ) {
        el.textContent = "";
      } else if (el.classList.contains("resetable")) {
        el.textContent = "--";
      }
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Masquer toutes les sections
      sections.forEach((sec) => sec.classList.add("hidden"));

      // Afficher la section choisie
      const targetId = link.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
        resetSection(targetSection); // Réinitialiser la section affichée
      }

      // Supprimer l'état actif de tous les liens
      links.forEach((l) => l.classList.remove("bg-[#0423d0]", "rounded-2xl"));

      // Ajouter l'état actif au lien cliqué
      link.classList.add("bg-[#0423d0]", "rounded-2xl");
    });
  });

  // Afficher par défaut "Tableau de bord" et bouton actif
  const dashboard = document.getElementById("dashboard");
  if (dashboard) dashboard.classList.remove("hidden");

  const dashboardLink = document.querySelector(
    '.menu-link[data-target="dashboard"]'
  );
  if (dashboardLink) dashboardLink.classList.add("bg-[#0423d0]", "rounded-2xl");
});
