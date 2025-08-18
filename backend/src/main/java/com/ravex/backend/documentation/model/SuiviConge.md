# SuiviConge Model

## Description
Représente le suivi d'un congé pris par un agent.

## Attributs principaux
- `id` : Identifiant unique du suivi.
- `dateDebut`, `dateFin` : Période du congé.
- `jours` : Nombre de jours pris.
- `joursRattrapage` : Jours de rattrapage.
- `totalJours` : Total des jours (pris + rattrapage).

## Relations
- **Conge** : Le suivi est lié à un congé.
- **Agent** : Le suivi est lié à un agent.

## Méthodes utilitaires
- `calculerNombreJours()` : Calcule le nombre de jours entre deux dates.
- `isPeriodesValides()` : Vérifie la validité de la période.
- `updateJours()` : Met à jour automatiquement le