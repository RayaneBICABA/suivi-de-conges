class ResponsiveMenu {
    constructor(config = {}) {
        this.title = config.title || 'SUIVI CONGES';
        this.menuItems = config.menuItems || [
            { icon: 'fa-solid fa-gauge', text: 'Tableau de bord', href: '#' },
            { icon: 'fa-solid fa-plus', text: 'Ajouter un agent', href: '#' },
            { icon: 'fa-solid fa-people-roof', text: 'Gérer les congés', href: '#' }
        ];
        this.primaryColor = config.primaryColor || '#2563eb';
        this.darkColor = config.darkColor || '#1e40af';
        this.hoverColor = config.hoverColor || '#3b82f6';
        this.onNavigate = config.onNavigate || null;

        this.isMenuOpen = false;
        this.init();
    }

    createHTML() {
        return `
            <div class="mother-container bg-white min-h-screen w-full flex relative">
                <div class="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-30" style="background-color: ${this.primaryColor};">
                    <h2 class="text-xl text-white font-bold">${this.title}</h2>
                    <button id="burger-btn" class="text-white text-xl">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
                
                <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-35 hidden"></div>
                
                <div id="menu" class="menu h-screen fixed md:relative w-80 md:w-[13%] -translate-x-full md:translate-x-0 z-40 transition-transform duration-300 top-0 left-0" style="background-color: ${this.primaryColor};">
                    <div class="header h-16 md:h-[7%] flex justify-center items-center relative" style="background-color: ${this.darkColor};">
                        <h2 class="text-xl md:text-2xl text-white font-bold">${this.title}</h2>
                        <button id="close-btn" class="md:hidden absolute right-4 text-white text-xl">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    
                    <nav class="flex flex-col gap-4 p-4 md:p-2">
                        ${this.menuItems.map((item, index) => `
                            <a href="${item.href}" 
   class="nav-link text-white text-[clamp(0.85rem, 2vw, 1.2rem)] p-3 md:p-2 flex items-center rounded-2xl transition-colors" 
   data-index="${index}">
   <i class="${item.icon} mr-3 text-white text-[clamp(1rem, 2.5vw, 1.5rem)] p-2"></i>
   ${item.text}
</a>

                        `).join('')}
                    </nav>
                </div>
                
                <div class="main-content w-full md:w-[87%] pt-16 md:pt-0 min-h-screen flex-1">
                    <div class="p-4 md:p-6" id="main-content">
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const container = document.getElementById('responsive-menu-container');
        if (!container) {
            console.error('Container with id "responsive-menu-container" not found');
            return;
        }

        container.innerHTML = this.createHTML();
        this.bindEvents();
        this.setActiveLink(0);

        if (window.innerWidth < 768) {
            this.closeMenu();
        }
    }

    bindEvents() {
        const burgerBtn = document.getElementById('burger-btn');
        const closeBtn = document.getElementById('close-btn');
        const menu = document.getElementById('menu');
        const overlay = document.getElementById('overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        if (burgerBtn) {
            burgerBtn.addEventListener('click', () => this.toggleMenu());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMenu());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMenu());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                const menu = document.getElementById('menu');
                const overlay = document.getElementById('overlay');
                menu.classList.remove('-translate-x-full');
                menu.classList.add('translate-x-0');
                overlay.classList.add('hidden');
                document.body.style.overflow = 'auto';
                this.isMenuOpen = false;
            } else if (this.isMenuOpen) {

            } else {
                this.closeMenu();
            }
        });

        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveLink(index);

                if (window.innerWidth < 768) {
                    setTimeout(() => this.closeMenu(), 150);
                }

                if (this.onNavigate) {
                    this.onNavigate(this.menuItems[index], index);
                }
            });

            link.addEventListener('mouseenter', () => {
                if (!link.classList.contains('active-link')) {
                    link.style.backgroundColor = this.hoverColor;
                }
            });

            link.addEventListener('mouseleave', () => {
                if (!link.classList.contains('active-link')) {
                    link.style.backgroundColor = '';
                }
            });
        });
    }

    openMenu() {
        this.isMenuOpen = true;
        const menu = document.getElementById('menu');
        const overlay = document.getElementById('overlay');

        menu.classList.remove('-translate-x-full');
        menu.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isMenuOpen = false;
        const menu = document.getElementById('menu');
        const overlay = document.getElementById('overlay');

        menu.classList.add('-translate-x-full');
        menu.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    setActiveLink(index) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            link.style.backgroundColor = '';
        });

        if (navLinks[index]) {
            navLinks[index].classList.add('active-link');
            navLinks[index].style.backgroundColor = this.darkColor;
        }
    }

    updateContent(content) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = content;
        }
    }

    addMenuItem(item) {
        this.menuItems.push(item);
        this.init();
    }

    removeMenuItem(index) {
        if (index >= 0 && index < this.menuItems.length) {
            this.menuItems.splice(index, 1);
            this.init();
        }
    }
}