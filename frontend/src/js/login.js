import {apiUrl} from "./config.js";


/**
 * Classe pour gérer l'authentification
 */
class AuthService {
    /**
     * Connexion utilisateur
     */
    static async login(credentials) {
        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Vérifier la validité du token
     */
    static async verifyToken(token) {
        try {
            const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
            });

            const data = await response.json();
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Stocker le token et les infos utilisateur
     */
    static storeAuthData(authData) {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('userData', JSON.stringify(authData.user));
        
        // Optionnel : définir une date d'expiration
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24); // 24h
        localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }

    /**
     * Récupérer le token
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
     * Vérifier si l'utilisateur est connecté
     */
    static isLoggedIn() {
        const token = this.getToken();
        const expiration = localStorage.getItem('tokenExpiration');
        
        if (!token) return false;
        
        // Vérifier l'expiration
        if (expiration && new Date() > new Date(expiration)) {
            this.logout();
            return false;
        }
        
        return true;
    }

    /**
     * Déconnexion
     */
    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
    }
}

/**
 * Utilitaires pour l'interface
 */
class UIUtils {
    /**
     * Afficher un message d'erreur
     */
    static showError(message, containerId = 'error-container') {
        let errorContainer = document.getElementById(containerId);
        
        if (!errorContainer) {
            // Créer le container s'il n'existe pas
            errorContainer = document.createElement('div');
            errorContainer.id = containerId;
            errorContainer.className = 'mb-4';
            
            // L'insérer avant le formulaire
            const form = document.querySelector('form');
            form.parentNode.insertBefore(errorContainer, form);
        }

        errorContainer.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <span class="block sm:inline">
                    <strong>Erreur:</strong> ${message}
                </span>
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="this.parentElement.parentElement.style.display='none'">
                    <svg class="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                    </svg>
                </span>
            </div>
        `;
    }

    /**
     * Afficher un message de succès
     */
    static showSuccess(message, containerId = 'success-container') {
        let successContainer = document.getElementById(containerId);
        
        if (!successContainer) {
            successContainer = document.createElement('div');
            successContainer.id = containerId;
            successContainer.className = 'mb-4';
            
            const form = document.querySelector('form');
            form.parentNode.insertBefore(successContainer, form);
        }

        successContainer.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <span class="block sm:inline">
                    <strong>Succès:</strong> ${message}
                </span>
            </div>
        `;
    }

    /**
     * Masquer les messages
     */
    static hideMessages() {
        const errorContainer = document.getElementById('error-container');
        const successContainer = document.getElementById('success-container');
        
        if (errorContainer) errorContainer.innerHTML = '';
        if (successContainer) successContainer.innerHTML = '';
    }

    /**
     * Activer/désactiver le bouton de soumission
     */
    static toggleSubmitButton(isLoading, buttonText = 'Se connecter', loadingText = 'Connexion en cours...') {
        const submitButton = document.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = isLoading;
            
            if (isLoading) {
                submitButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ${loadingText}
                `;
                submitButton.classList.add('opacity-75', 'cursor-not-allowed');
            } else {
                submitButton.textContent = buttonText;
                submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        }
    }

    /**
     * Animer la redirection
     */
    static animateRedirect(url, delay = 1500) {
        const card = document.querySelector('.bg-\\[\\#ffffff\\]');
        if (card) {
            card.classList.add('transform', 'scale-95', 'opacity-75');
        }
        
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
}

/**
 * Validation côté client
 */
class FormValidator {
    /**
     * Valider l'email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valider le formulaire de connexion
     */
    static validateLoginForm(formData) {
        const errors = [];

        if (!formData.email || formData.email.trim() === '') {
            errors.push('L\'adresse email est obligatoire');
        } else if (!this.isValidEmail(formData.email)) {
            errors.push('Format d\'email invalide');
        }

        if (!formData.password || formData.password.trim() === '') {
            errors.push('Le mot de passe est obligatoire');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

/**
 * Gestionnaire principal de la page de connexion
 */
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    if (AuthService.isLoggedIn()) {
        // Rediriger vers le dashboard si déjà connecté
        window.location.href = './dashboard.html'; // Adaptez selon votre architecture
        return;
    }

    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', handleLoginSubmit);
        
        // Ajout de validation en temps réel
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !FormValidator.isValidEmail(this.value)) {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.remove('border-red-500');
                }
            });
        }

        // Auto-focus sur le premier champ
        if (emailInput) {
            emailInput.focus();
        }
    }

    // Gestion des raccourcis clavier
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            // Ctrl + Enter pour soumettre rapidement
            const form = document.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
});

/**
 * Gestionnaire de soumission du formulaire de connexion
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Masquer les messages précédents
    UIUtils.hideMessages();
    
    // Récupérer les données du formulaire
    const formData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };
    
    // Validation côté client
    const validation = FormValidator.validateLoginForm(formData);
    
    if (!validation.isValid) {
        UIUtils.showError(validation.errors.join('<br>'));
        return;
    }
    
    // Désactiver le bouton pendant la requête
    UIUtils.toggleSubmitButton(true);
    
    try {
        // Appel à l'API de connexion
        const result = await AuthService.login(formData);
        
        if (result.success) {
            // Stocker les données d'authentification
            AuthService.storeAuthData(result.data);
            
            // Afficher le succès
            UIUtils.showSuccess(`Bienvenue, ${result.data.user.firstname} ! Redirection...`);
            
            // Redirection animée vers le dashboard
            UIUtils.animateRedirect('./dashboard.html'); // Adaptez selon votre architecture
            
        } else {
            UIUtils.showError(result.error);
            
            // Focus sur le champ email en cas d'erreur d'authentification
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
                emailInput.select();
            }
        }
        
    } catch (error) {
        UIUtils.showError('Une erreur de connexion s\'est produite. Vérifiez votre connexion internet.');
        console.error('Erreur de connexion:', error);
    } finally {
        // Réactiver le bouton
        UIUtils.toggleSubmitButton(false);
    }
}

/**
 * Utilitaire pour la démo (optionnel)
 */
function fillDemoCredentials() {
    document.getElementById('email').value = 'demo@example.com';
    document.getElementById('password').value = 'password123';
}

// Export pour utilisation dans d'autres fichiers si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService, UIUtils, FormValidator };
}