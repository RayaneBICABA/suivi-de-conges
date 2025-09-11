// dashboard.js - Gestion du tableau de bord
import {apiUrl} from "./config.js";
const API_BASE_URL = apiUrl;

// Variables globales pour stocker les données
let allAgents = [];
let currentAgentDetails = null;

// Initialisation du dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadAgentsList();
    setupSearchFunctionality();
    setupYearFilter();
});

// ==================== CHARGEMENT DES STATISTIQUES ====================
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
        
        const stats = await response.json();
        
        // Mise à jour des cartes de statistiques
        document.getElementById('totalAgents').textContent = stats.totalAgent || 0;
        document.getElementById('congesEnCours').textContent = stats.congeEnCours || 0;
        document.getElementById('congesTermines').textContent = stats.congeTermines || 0;
        
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        showNotification('Erreur lors du chargement des statistiques', 'error');
    }
}

// ==================== CHARGEMENT DE LA LISTE DES AGENTS ====================
async function loadAgentsList() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/agents`);
        if (!response.ok) throw new Error('Erreur lors du chargement de la liste des agents');
        
        const agents = await response.json();
        allAgents = agents;
        displayAgents(agents);
        
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des agents:', error);
        showNotification('Erreur lors du chargement de la liste des agents', 'error');
    }
}

// ==================== AFFICHAGE DES AGENTS ====================
function displayAgents(agents) {
    const agentsListElement = document.getElementById('agentsList');
    if (!agentsListElement) return;
    
    if (agents.length === 0) {
        agentsListElement.innerHTML = `
            <tr>
                <td colspan="4" class="py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-2 opacity-50"></i>
                    <p>Aucun agent trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    agentsListElement.innerHTML = agents.map(agent => {
        // Génération des initiales pour l'avatar
        const initials = getInitials(agent.fullname);
        const avatarColor = getAvatarColor(agent.matricule);
        
        return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">
                    ${agent.matricule}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                            ${initials}
                        </div>
                        <span class="font-medium text-gray-900 text-sm md:text-base">${agent.fullname}</span>
                    </div>
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4 text-gray-600 text-sm md:text-base">
                    ${agent.fonction || 'Non spécifié'}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4 text-center">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        onclick="voirDetails('${agent.matricule}')">
                        Détails
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ==================== FONCTION POUR VOIR LES DÉTAILS D'UN AGENT ====================
async function voirDetails(matricule) {
    try {
        // Afficher un loader
        showAgentDetailsLoader();
        
        const response = await fetch(`${API_BASE_URL}/dashboard/${matricule}/details`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Agent non trouvé');
            }
            throw new Error('Erreur lors du chargement des détails de l\'agent');
        }
        
        const agentDetails = await response.json();
        currentAgentDetails = agentDetails;
        
        // Mettre à jour le filtre d'année avec les années disponibles pour cet agent
        updateYearFilter(agentDetails);
        
        // Afficher les détails de l'agent
        displayAgentDetails(agentDetails);
        
    } catch (error) {
        console.error('Erreur lors du chargement des détails de l\'agent:', error);
        showAgentDetailsError(error.message);
        // showNotification(error.message, 'error');
    }
}

// ==================== MISE À JOUR DU FILTRE D'ANNÉE ====================
function updateYearFilter(agent) {
    const yearFilterElement = document.getElementById('yearFilter');
    if (!yearFilterElement || !agent.conges) return;
    
    // Récupérer la valeur actuellement sélectionnée
    const currentSelection = yearFilterElement.value;
    
    // Extraire toutes les années disponibles pour cet agent
    const availableYears = [...new Set(agent.conges.map(conge => conge.annee))]
        .sort((a, b) => {
            // Tri décroissant (année la plus récente en premier)
            // Gestion des années au format "22" vs "2022"
            const yearA = a.length === 2 ? `20${a}` : a;
            const yearB = b.length === 2 ? `20${b}` : b;
            return parseInt(yearB) - parseInt(yearA);
        });
    
    // Si aucune année disponible, afficher un message par défaut
    if (availableYears.length === 0) {
        yearFilterElement.innerHTML = `
            <option value="">Aucune année disponible</option>
        `;
        return;
    }
    
    // Construire les options du select
    yearFilterElement.innerHTML = availableYears.map(year => {
        // Normaliser l'affichage de l'année
        const displayYear = year.length === 2 ? `20${year}` : year;
        return `<option value="${year}" ${year === currentSelection ? 'selected' : ''}>${displayYear}</option>`;
    }).join('');
    
    // Si l'année précédemment sélectionnée n'est plus disponible,
    // sélectionner la première année disponible
    if (!availableYears.includes(currentSelection)) {
        yearFilterElement.value = availableYears[0];
    }
}

// ==================== AFFICHAGE DES DÉTAILS DE L'AGENT ====================
function displayAgentDetails(agent) {
    const agentDetailsElement = document.getElementById('agentDetails');
    if (!agentDetailsElement) return;
    
    // Récupérer l'année sélectionnée
    const yearFilterElement = document.getElementById('yearFilter');
    const selectedYear = yearFilterElement?.value || (agent.conges && agent.conges.length > 0 ? agent.conges[0].annee : new Date().getFullYear().toString());
    
    // Filtrer les congés par année
    const filteredConges = agent.conges ? agent.conges.filter(conge => conge.annee === selectedYear) : [];
    
    // Générer les initiales et la couleur de l'avatar
    const fullName = `${agent.prenom} ${agent.nom}`;
    const initials = getInitials(fullName);
    const avatarColor = getAvatarColor(agent.matricule);
    
    // Normaliser l'affichage de l'année sélectionnée
    const displaySelectedYear = selectedYear.length === 2 ? `20${selectedYear}` : selectedYear;
    
    agentDetailsElement.innerHTML = `
        <div class="space-y-4">
            <!-- Informations de l'agent -->
            <div class="text-center mb-6">
                <div class="w-16 h-16 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    ${initials}
                </div>
                <h3 class="text-xl font-bold text-gray-800">${fullName}</h3>
                <p class="text-gray-600">${agent.fonction || 'Non spécifié'}</p>
                <p class="text-sm text-gray-500">Matricule: ${agent.matricule}</p>
            </div>
            
            <!-- Congés pour l'année sélectionnée -->
            <div class="space-y-4">
                <h4 class="font-semibold text-gray-800">Congés ${displaySelectedYear}</h4>
                ${filteredConges.length === 0 ? `
                    <div class="text-center py-6 text-gray-500">
                        <i class="fas fa-calendar-times text-3xl mb-2 opacity-50"></i>
                        <p class="text-sm">Aucun congé pour l'année ${displaySelectedYear}</p>
                    </div>
                ` : filteredConges.map(conge => `
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="space-y-2">
                            <div class="flex justify-between items-start">
                                <span class="font-medium text-gray-800">Réf: ${conge.reference}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ${conge.annee.length === 2 ? `20${conge.annee}` : conge.annee}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Jours attribués:</span>
                                    <span class="font-bold text-blue-600">${conge.joursAttribues || 0}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Jours restants:</span>
                                    <span class="font-bold ${conge.joursRestants > 0 ? 'text-green-600' : 'text-red-600'}">
                                        ${conge.joursRestants || 0}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Suivis de congé -->
                            ${conge.suivis && conge.suivis.length > 0 ? `
                                <div class="mt-3">
                                    <h5 class="text-sm font-medium text-gray-700 mb-2">Historique des congés:</h5>
                                    <div class="space-y-2">
                                        ${conge.suivis.map(suivi => `
                                            <div class="bg-white rounded p-2 border border-gray-100 text-sm">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">
                                                        ${formatDate(suivi.dateDebut)} - ${formatDate(suivi.dateFin)}
                                                    </span>
                                                    <span class="font-medium text-orange-600">
                                                        ${suivi.jours} jour${suivi.jours > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div class="mt-3 text-center text-gray-500 text-sm">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Aucun congé pris pour cette référence
                                </div>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== FONCTIONS UTILITAIRES ====================
function getInitials(fullName) {
    return fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function getAvatarColor(matricule) {
    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
        'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    
    // Utiliser le matricule pour générer un index consistant
    const hash = matricule.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// ==================== LOADER ET ERREURS ====================
function showAgentDetailsLoader() {
    const agentDetailsElement = document.getElementById('agentDetails');
    if (!agentDetailsElement) return;
    
    agentDetailsElement.innerHTML = `
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-gray-500">Chargement des détails...</p>
        </div>
    `;
}

function showAgentDetailsError(errorMessage) {
    const agentDetailsElement = document.getElementById('agentDetails');
    if (!agentDetailsElement) return;
    
    agentDetailsElement.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-600">${errorMessage}</p>
        </div>
    `;
}

// ==================== FONCTIONNALITÉ DE RECHERCHE ====================
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const keyword = this.value.trim();
            
            if (keyword === '') {
                // Si la recherche est vide, afficher tous les agents
                displayAgents(allAgents);
            } else {
                // Rechercher via l'API
                searchAgents(keyword);
            }
        }, 300); // Délai de 300ms pour éviter trop de requêtes
    });
}

async function searchAgents(keyword) {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/agents/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        
        const agents = await response.json();
        displayAgents(agents);
        
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        showNotification('Erreur lors de la recherche', 'error');
        // En cas d'erreur, filtrer localement
        const filteredAgents = allAgents.filter(agent => 
            agent.fullname.toLowerCase().includes(keyword.toLowerCase()) ||
            agent.matricule.toLowerCase().includes(keyword.toLowerCase()) ||
            (agent.fonction && agent.fonction.toLowerCase().includes(keyword.toLowerCase()))
        );
        displayAgents(filteredAgents);
    }
}

// ==================== FILTRE PAR ANNÉE ====================
function setupYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    if (!yearFilter) return;
    
    yearFilter.addEventListener('change', function() {
        if (currentAgentDetails) {
            displayAgentDetails(currentAgentDetails);
        }
    });
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Définir les couleurs selon le type
    const colors = {
        'success': 'bg-green-500 text-white',
        'error': 'bg-red-500 text-white',
        'warning': 'bg-yellow-500 text-black',
        'info': 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    
    // Ajouter l'icône selon le type
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}   

// ==================== RAFRAÎCHISSEMENT DES DONNÉES ====================
function refreshDashboard() {
    loadDashboardStats();
    loadAgentsList();
    
    // Réinitialiser les détails de l'agent et le filtre d'année
    const agentDetailsElement = document.getElementById('agentDetails');
    if (agentDetailsElement) {
        agentDetailsElement.innerHTML = `
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-user-circle text-4xl md:text-6xl mb-3 md:mb-4"></i>
                <p class="text-sm md:text-base">Sélectionnez un agent pour voir ses détails</p>
            </div>
        `;
    }
    
    // Réinitialiser le filtre d'année
    const yearFilterElement = document.getElementById('yearFilter');
    if (yearFilterElement) {
        yearFilterElement.innerHTML = `
            <option value="">Sélectionnez un agent</option>
        `;
    }
    
    currentAgentDetails = null;
}

// ==================== EXPORT DES FONCTIONS GLOBALES ====================
// Rendre la fonction voirDetails disponible globalement pour les onclick HTML
window.voirDetails = voirDetails;
window.refreshDashboard = refreshDashboard;