import {apiUrl} from "./config.js";

// Variable pour stocker les directions
let directionsData = [];

/**
 * Charge les directions dans le select
 */
function loadDirections() {
    const directionSelect = document.getElementById('direction');
    
    if (!directionSelect) return;
    
    // Vider le select sauf la première option
    directionSelect.innerHTML = '<option value="">-- Sélectionnez une direction --</option>';
    
    // Ajouter chaque direction comme option
    directionsData.forEach(direction => {
        const option = document.createElement('option');
        option.value = direction.numero;
        option.textContent = direction.nom;
        directionSelect.appendChild(option);
    });
}

async function fetchDirections() {
    try {
        // Utiliser votre API URL depuis config.js
        const response = await fetch(`${apiUrl}/api/direction`);
        const data = await response.json();
        
        // Mettre à jour les données et recharger le select
        directionsData.length = 0; // Vider le tableau
        directionsData.push(...data); // Ajouter les nouvelles données
        loadDirections();
        
    } catch (error) {
        console.error('Erreur lors du chargement des directions:', error);
        
        // En cas d'erreur, utiliser des données par défaut ou afficher une erreur
        UIUtils.showError('Erreur lors du chargement des directions');
    }
}


/**
 * Classe pour gérer l'authentification
 */
class AuthService {
    /**
     * Enregistrer un nouvel utilisateur
     */
    static async register(userData) {
        try {
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
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
     * Stocker le token et les infos utilisateur
     */
    static storeAuthData(authData) {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('userData', JSON.stringify(authData.user));
    }

    /**
     * Récupérer le token
     */
    static getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Vérifier si l'utilisateur est connecté
     */
    static isLoggedIn() {
        const token = this.getToken();
        return token !== null && token !== '';
    }

    /**
     * Déconnexion
     */
    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
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
                <strong>Erreur:</strong> ${message}
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
                <strong>Succès:</strong> ${message}
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
    static toggleSubmitButton(isLoading, buttonText = 'Créer un compte', loadingText = 'Création en cours...') {
        const submitButton = document.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.textContent = isLoading ? loadingText : buttonText;
            
            if (isLoading) {
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
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
     * Valider le mot de passe
     */
    static isValidPassword(password) {
        return password && password.length >= 8;
    }

    /**
     * Vérifier si les mots de passe correspondent
     */
    static passwordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    /**
     * Valider le formulaire d'inscription
     */
    static validateRegisterForm(formData) {
        const errors = [];

        if (!formData.firstname || formData.firstname.trim() === '') {
            errors.push('Le prénom est obligatoire');
        }

        if (!formData.lastname || formData.lastname.trim() === '') {
            errors.push('Le nom est obligatoire');
        }

        if (!formData.username || formData.username.trim() === '') {
            errors.push('Le nom d\'utilisateur est obligatoire');
        }

        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Adresse email invalide');
        }

        if (!this.isValidPassword(formData.password)) {
            errors.push('Le mot de passe doit contenir au moins 8 caractères');
        }

        if (!this.passwordsMatch(formData.password, formData.confirmPassword)) {
            errors.push('Les mots de passe ne correspondent pas');
        }

        // Vérifier si une direction a été sélectionnée
const directionSelect = document.getElementById('direction');
if (!directionSelect || !directionSelect.value) {
    errors.push('La direction est obligatoire');
}


        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

/**
 * Gestionnaire principal du formulaire d'inscription
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', handleRegisterSubmit);
    }

    fetchDirections();
});



/**
 * Gestionnaire de soumission du formulaire
 */
async function handleRegisterSubmit(event) {
    event.preventDefault();
    
    // Masquer les messages précédents
    UIUtils.hideMessages();
    
    // Récupérer les données du formulaire
    const formData = {
        firstname: document.getElementById('prenom').value.trim(),
        lastname: document.getElementById('nom').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value
    };
    
    // Validation côté client
    const validation = FormValidator.validateRegisterForm(formData);
    
    if (!validation.isValid) {
        UIUtils.showError(validation.errors.join('<br>'));
        return;
    }
    
    // Préparer les données pour l'API (sans confirmPassword)
   const directionSelect = document.getElementById('direction');
const selectedDirection = directionSelect.value;

if (!selectedDirection) {
    UIUtils.showError('Veuillez sélectionner une direction');
    return;
}

// Trouver l'objet direction complet
const selectedDirectionData = directionsData.find(dir => dir.numero == selectedDirection);

const apiData = {
    firstname: formData.firstname,
    lastname: formData.lastname,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    directionDto: {
        numero: selectedDirectionData.numero,
        nom: selectedDirectionData.nom
    }
};
    
    // Désactiver le bouton pendant la requête
    UIUtils.toggleSubmitButton(true);
    
    try {
        // Appel à l'API
        const result = await AuthService.register(apiData);
        
        if (result.success) {
            // Stocker les données d'authentification
            AuthService.storeAuthData(result.data);
            
            // Afficher le succès
            UIUtils.showSuccess('Compte créé avec succès ! Redirection...');
            
            // Rediriger après 2 secondes
            setTimeout(() => {
                window.location.href = './index.html'; // Ou votre page d'accueil
            }, 2000);
            
        } else {
            UIUtils.showError(result.error);
        }
        
    } catch (error) {
        UIUtils.showError('Une erreur inattendue s\'est produite');
        console.error('Erreur:', error);
    } finally {
        // Réactiver le bouton
        UIUtils.toggleSubmitButton(false);
    }
}