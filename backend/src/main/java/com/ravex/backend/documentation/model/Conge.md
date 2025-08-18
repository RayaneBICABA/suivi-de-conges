# Conge Model

## Description
Représente un congé accordé à un agent.

## Attributs principaux
- `reference` : Identifiant unique du congé.
- `jours` : Nombre de jours accordés.
- `dateDemande` : Date de la demande du congé.

## Relations
- **Agent** : Le congé est lié à un agent.
- **SuiviConges** : Liste des suivis associés à ce congé.

## Méthodes utilitaires
- `getJoursUtilises()` : Nombre de jours déjà utilisés.
- `getJoursRestants()` : Nombre de jours restants.
- `isCompletementUtilise()` : Indique si le congé est totalement utilisé.

---
