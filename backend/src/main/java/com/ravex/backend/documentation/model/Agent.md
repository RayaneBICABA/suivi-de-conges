# Agent Model

## Description
Représente un agent (utilisateur) du système de suivi des congés.

## Attributs principaux
- `matricule` : Identifiant unique de l'agent.
- `nom` : Nom de l'agent.
- `prenom` : Prénom de l'agent.
- `unite`, `service`, `centre`, `fonction`, `cout`, `classe` : Informations organisationnelles.

## Relations
- **Congés** : Un agent possède une liste de congés (`List<Conge>`).
- **SuiviConges** : Un agent possède une liste de suivis de congés (`List<SuiviConge>`).

## Méthodes utilitaires
- `getFullName()` : Retourne le nom complet.
- `getTotalJoursConge()` : Total des jours de congé accordés.
- `getTotalJoursPris()` : Total des jours de congé pris.
- `getJoursRestants()` : Jours de congé restants.

---
