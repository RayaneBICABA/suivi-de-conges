// authGuard.js - Système de protection des routes
import { apiUrl } from "./config.js";

/**
 * Gestionnaire d'authentification et de protection des routes
 */
class AuthGuard {
    /**
     * Vérifier si l'utilisateur est authentifié et peut accéder à la page
     */
    static async checkAuth() {
        try {
            const token = this.getToken();
            
            if (!token) {
                this.redirectToLogin();
                return false;
            }

            // Vérifier la validité du token auprès du serveur
            const isValid = await this.verifyTokenWithServer(token);
            
            if (!isValid) {
                this.clearAuthData();
                this.redirectToLogin();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la vérification d\'authentification:', error);
            this.clearAuthData();
            this.redirectToLogin();
            return false;
        }
    }

    /**
     * Vérifier le token auprès du serveur backend
     */
    static async verifyTokenWithServer(token) {
        try {
            const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de la vérification du token:', error);
            return false;
        }
    }

    /**
     * Récupérer le token depuis le localStorage
     */
    static getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Récupérer les données utilisateur
     */
    static getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Vérifier si le token est expiré localement
     */
    static isTokenExpired() {
        const expiration = localStorage.getItem('tokenExpiration');
        if (!expiration) return true;
        
        return new Date() > new Date(expiration);
    }

    /**
     * Nettoyer toutes les données d'authentification
     */
    static clearAuthData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
    }

    /**
     * Rediriger vers la page de connexion
     */
    static redirectToLogin() {
        // Sauvegarder l'URL actuelle pour redirection après connexion
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem('redirectAfterLogin', currentPath);
        
        window.location.href = './login.html';
    }

    /**
     * Rediriger vers la page demandée après connexion
     */
    static redirectAfterLogin() {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');
        
        if (redirectPath && redirectPath !== '/login.html') {
            window.location.href = redirectPath;
        } else {
            window.location.href = './index.html';
        }
    }

    /**
     * Intercepter les requêtes API pour ajouter automatiquement le token
     */
    static setupAPIInterceptor() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(url, options = {}) {
            // Ajouter le token aux requêtes API
            if (url.includes(apiUrl)) {
                const token = AuthGuard.getToken();
                
                if (token) {
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${token}`
                    };
                }
            }

            try {
                const response = await originalFetch(url, options);
                
                // Gérer les erreurs 401 (Non autorisé)
                if (response.status === 401 && url.includes(apiUrl)) {
                    AuthGuard.handleUnauthorized();
                }
                
                return response;
            } catch (error) {
                throw error;
            }
        };
    }

    /**
     * Gérer les erreurs d'autorisation (401)
     */
    static handleUnauthorized() {
        this.clearAuthData();
        this.showSessionExpiredMessage();
        
        setTimeout(() => {
            this.redirectToLogin();
        }, 3000);
    }

    /**
     * Afficher un message de session expirée
     */
    static showSessionExpiredMessage() {
        // Créer un overlay de notification
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-auto text-center">
                <div class="mb-4">
                    <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Session expirée</h3>
                <p class="text-sm text-gray-500 mb-4">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion.
                </p>
                <button onclick="this.parentElement.parentElement.remove(); AuthGuard.redirectToLogin();" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Se reconnecter maintenant
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    /**
     * Initialiser le système de protection
     */
    static async init() {
        // Configurer l'intercepteur API
        this.setupAPIInterceptor();
        
        // Vérifier l'authentification pour les pages protégées
        const protectedPages = ['index.html', 'dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) || currentPage === '') {
            const isAuthenticated = await this.checkAuth();
            
            if (isAuthenticated) {
                // Optionnel: Afficher les infos utilisateur
                this.displayUserInfo();
                return true;
            }
            return false;
        }
        
        return true;
    }

    /**
     * Afficher les informations utilisateur dans l'interface
     */
    static displayUserInfo() {
        const userData = this.getUserData();
        if (!userData) return;

        // Rechercher un élément pour afficher le nom d'utilisateur
        const userDisplayElements = document.querySelectorAll('[data-user-display]');
        userDisplayElements.forEach(element => {
            const displayType = element.getAttribute('data-user-display');
            switch (displayType) {
                case 'fullname':
                    element.textContent = `${userData.firstname} ${userData.lastname}`;
                    break;
                case 'firstname':
                    element.textContent = userData.firstname;
                    break;
                case 'username':
                    element.textContent = userData.username;
                    break;
                case 'email':
                    element.textContent = userData.email;
                    break;
            }
        });
    }

    /**
     * Gérer la déconnexion
     */
    static logout() {
        this.clearAuthData();
        
        // Afficher un message de confirmation
        const confirmLogout = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
        
        if (confirmLogout) {
            // Optionnel: Notifier le serveur de la déconnexion
            this.notifyServerLogout();
            
            this.redirectToLogin();
        }
    }

    /**
     * Notifier le serveur de la déconnexion (optionnel)
     */
    static async notifyServerLogout() {
        try {
            const token = this.getToken();
            if (token) {
                await fetch(`${apiUrl}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.log('Impossible de notifier le serveur de la déconnexion:', error);
        }
    }
}

// Configuration automatique au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    await AuthGuard.init();
});

// Exporter pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
}

// Rendre disponible globalement
window.AuthGuard = AuthGuard;