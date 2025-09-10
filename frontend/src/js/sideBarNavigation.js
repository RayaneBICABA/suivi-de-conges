document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu-link");
    const mobileLinks = document.querySelectorAll(".mobile-menu-link");
    const sections = document.querySelectorAll(
        "#dashboard, #manageLeaves, #addAgent, #priseCongeSection, #addProvider"
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

    // Fonction pour rafraîchir le tableau de bord
    function refreshDashboard() {
        // Vérifier si la fonction refreshDashboard existe dans le scope global
        if (typeof window.refreshDashboard === 'function') {
            window.refreshDashboard();
        } else {
            // Fallback : recharger manuellement les données du dashboard
            console.log('Rafraîchissement du tableau de bord...');
            
            // Si les fonctions de dashboard.js sont disponibles
            if (typeof window.loadDashboardStats === 'function') {
                window.loadDashboardStats();
            }
            if (typeof window.loadAgentsList === 'function') {
                window.loadAgentsList();
            }
        }
    }

    // Fonction pour gérer la navigation
    function handleNavigation(targetId, clickedLink, allLinks) {
        // Masquer toutes les sections
        sections.forEach((sec) => sec.classList.add("hidden"));

        // Afficher la section choisie
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove("hidden");
            resetSection(targetSection);
            
            // Rafraîchir les données si on navigue vers le dashboard
            if (targetId === "dashboard") {
                // Petit délai pour permettre à l'affichage de se faire avant le rafraîchissement
                setTimeout(() => {
                    refreshDashboard();
                }, 100);
            }
        }

        // Supprimer l'état actif de tous les liens (desktop et mobile)
        allLinks.forEach((l) => l.classList.remove("bg-[#0423d0]", "rounded-2xl"));

        // Ajouter l'état actif au lien cliqué
        if (clickedLink) {
            clickedLink.classList.add("bg-[#0423d0]", "rounded-2xl");
            
            // Synchroniser l'état entre desktop et mobile
            const targetValue = clickedLink.getAttribute("data-target");
            allLinks.forEach(link => {
                if (link.getAttribute("data-target") === targetValue) {
                    link.classList.add("bg-[#0423d0]", "rounded-2xl");
                }
            });
        }
    }

    // Combiner tous les liens (desktop + mobile)
    const allLinks = [...links, ...mobileLinks];

    // Event listeners pour les liens desktop
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            handleNavigation(targetId, link, allLinks);
        });
    });

    // Event listeners pour les liens mobile
    mobileLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            handleNavigation(targetId, link, allLinks);
            
            // Fermer le menu mobile après navigation
            if (typeof closeMobileMenuFunc === 'function') {
                closeMobileMenuFunc();
            }
        });
    });

    // Event listeners pour les boutons "Actions Rapides" du dashboard
    const addAgentQuickBtn = document.querySelector('button[onclick="switchToSection(\'addAgent\')"]');
    const manageQuickBtn = document.querySelector('button[onclick="switchToSection(\'manageLeaves\')"]');

    if (addAgentQuickBtn) {
        addAgentQuickBtn.removeAttribute('onclick');
        addAgentQuickBtn.addEventListener('click', () => {
            handleNavigation('addAgent', null, allLinks);
        });
    }

    if (manageQuickBtn) {
        manageQuickBtn.removeAttribute('onclick');
        manageQuickBtn.addEventListener('click', () => {
            handleNavigation('manageLeaves', null, allLinks);
        });
    }

    // Fonction globale pour la navigation (utilisée par les boutons HTML)
    window.switchToSection = function(sectionId) {
        handleNavigation(sectionId, null, allLinks);
        
        // Rafraîchir le dashboard si on y navigue
        if (sectionId === "dashboard") {
            setTimeout(() => {
                refreshDashboard();
            }, 100);
        }
    };

    // Afficher par défaut "Tableau de bord" et bouton actif
    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
        dashboard.classList.remove("hidden");
        
        // Charger les données initiales du dashboard
        setTimeout(() => {
            refreshDashboard();
        }, 100);
    }
    
    const dashboardLinks = allLinks.filter(link => 
        link.getAttribute("data-target") === "dashboard"
    );
    dashboardLinks.forEach(link => {
        link.classList.add("bg-[#0423d0]", "rounded-2xl");
    });

    // Observer pour détecter les changements dans les autres sections
    // et rafraîchir le dashboard quand on y revient
    let lastActiveSection = "dashboard";
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                
                // Vérifier si une section devient visible
                if (!target.classList.contains('hidden') && target.id !== lastActiveSection) {
                    lastActiveSection = target.id;
                    
                    // Si on revient au dashboard depuis une autre section, rafraîchir
                    if (target.id === 'dashboard') {
                        setTimeout(() => {
                            refreshDashboard();
                        }, 100);
                    }
                }
            }
        });
    });

    // Observer tous les changements sur les sections
    sections.forEach(section => {
        observer.observe(section, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });
});

// Fonction utilitaire pour forcer le rafraîchissement depuis d'autres scripts
window.forceRefreshDashboard = function() {
    if (typeof window.refreshDashboard === 'function') {
        window.refreshDashboard();
    }
};