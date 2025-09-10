// navigation.js - Composant de navigation réutilisable

export class Navigation {
    constructor(currentPage = 'dashboard') {
        this.currentPage = currentPage;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
    }

    // Générer le HTML de la sidebar
    generateSidebarHTML() {
        return `
            <!-- Mobile Overlay -->
            <div id="mobileOverlay" class="mobile-overlay fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>

            <!-- Desktop Sidebar -->
            <div class="hidden md:flex flex-col w-[15vw] bg-gray-800">
                <!-- Header -->
                <div class="flex items-center justify-center h-16 bg-[#0423D0]">
                    <span class="text-white font-bold uppercase text-xl sm:text-2xl">
                        Suivi De Conges
                    </span>
                </div>

                <!-- Navigation -->
                <div class="flex flex-col flex-1 overflow-y-auto">
                    <nav class="flex-1 px-2 py-4 bg-[#2563eb]">
                        <a href="./index.html"
                            class="menu-link flex items-center px-4 py-3 text-gray-100 text-lg sm:text-xl hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'dashboard' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-gauge mr-3 text-white"></i>
                            Tableau de bord
                        </a>
                        <a href="./src/html/ajouter-agent.html"
                            class="menu-link flex items-center px-4 py-3 mt-2 text-gray-100 text-lg sm:text-xl hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'addAgent' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-plus mr-3 text-white"></i>
                            Ajouter un agent
                        </a>
                        <a href="./src/html/gerer-conges.html"
                            class="menu-link flex items-center px-4 py-3 mt-2 text-gray-100 text-lg sm:text-xl hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'manageLeaves' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-people-roof mr-3 text-white"></i>
                            Gérer les congés
                        </a>
                    </nav>
                </div>
            </div>

            <!-- Mobile Sidebar -->
            <div id="mobileSidebar" class="mobile-sidebar md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-800">
                <!-- Header -->
                <div class="flex items-center justify-between h-16 bg-[#0423D0] px-4">
                    <span class="text-white font-bold uppercase text-lg">
                        Suivi De Conges
                    </span>
                    <button id="closeMobileMenu" class="text-white hover:text-gray-300">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Navigation -->
                <div class="flex flex-col flex-1 overflow-y-auto">
                    <nav class="flex-1 px-2 py-4 bg-[#2563eb]">
                        <a href="./index.html"
                            class="mobile-menu-link flex items-center px-4 py-3 text-gray-100 text-lg hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'dashboard' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-gauge mr-3 text-white"></i>
                            Tableau de bord
                        </a>
                        <a href="./src/html/ajouter-agent.html"
                            class="mobile-menu-link flex items-center px-4 py-3 mt-2 text-gray-100 text-lg hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'addAgent' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-plus mr-3 text-white"></i>
                            Ajouter un agent
                        </a>
                        <a href="./src/html/gerer-conges.html"
                            class="mobile-menu-link flex items-center px-4 py-3 mt-2 text-gray-100 text-lg hover:bg-[#0423d0] hover:rounded-2xl ${this.currentPage === 'manageLeaves' ? 'bg-[#0423d0] rounded-2xl' : ''}">
                            <i class="fa-solid fa-people-roof mr-3 text-white"></i>
                            Gérer les congés
                        </a>
                    </nav>
                </div>
            </div>
        `;
    }

    // Générer le header avec burger menu
    generateHeaderHTML(title, hasSearch = false) {
        return `
            <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
                <!-- Mobile burger menu -->
                <button id="burgerMenuBtn" class="md:hidden text-gray-600 hover:text-gray-900">
                    <i class="fas fa-bars text-xl"></i>
                </button>

                <h1 class="text-xl md:text-2xl font-bold">${title}</h1>
                
                ${hasSearch ? `
                    <div class="flex items-center w-full md:w-[55%] ml-4 md:ml-0">
                        <input id="searchInput"
                            class="w-full border rounded-full px-3 md:px-4 py-2 border-gray-400 text-sm md:text-base"
                            type="text" placeholder="Rechercher un agent..." />
                    </div>
                ` : '<div class="w-6"></div>'}
                
                <div class="flex items-center space-x-4">
                    <span data-user-display="firstname" class="text-sm font-medium text-gray-700"></span>
                    <button onclick="AuthGuard.logout()"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                        Déconnexion
                    </button>
                </div>
            </div>
        `;
    }

    setupMobileMenu() {
        document.addEventListener('DOMContentLoaded', () => {
            const burgerMenuBtn = document.getElementById('burgerMenuBtn');
            const mobileSidebar = document.getElementById('mobileSidebar');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const closeMobileMenu = document.getElementById('closeMobileMenu');

            function openMobileMenu() {
                mobileSidebar?.classList.add('active');
                mobileOverlay?.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeMobileMenuFunc() {
                mobileSidebar?.classList.remove('active');
                mobileOverlay?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            burgerMenuBtn?.addEventListener('click', openMobileMenu);
            closeMobileMenu?.addEventListener('click', closeMobileMenuFunc);
            mobileOverlay?.addEventListener('click', closeMobileMenuFunc);

            // Exposer la fonction globalement
            window.closeMobileMenuFunc = closeMobileMenuFunc;
        });
    }

    setupNavigation() {
        // La navigation se fait maintenant par des liens directs
        // Plus besoin de JavaScript pour changer de section
    }

    // Injecter la navigation dans une page
    injectIntoPage(containerId = 'navigation-container') {
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = this.generateSidebarHTML();
            }
        });
    }
}

// Styles CSS pour le mobile
export const navigationStyles = `
    .mobile-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
    }

    .mobile-sidebar.active {
        transform: translateX(0);
    }

    .mobile-overlay {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    }

    .mobile-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
`;