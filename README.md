# Suivi de Congés SONABEL

Application web fullstack pour la gestion et le suivi des congés des agents SONABEL.

## Sommaire

- [Suivi de Congés SONABEL](#suivi-de-congés-sonabel)
  - [Sommaire](#sommaire)
  - [Présentation](#présentation)
  - [Fonctionnalités](#fonctionnalités)
  - [Architecture](#architecture)
  - [Installation](#installation)
    - [Prérequis](#prérequis)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Utilisation](#utilisation)
  - [Captures d’écran](#captures-décran)
  - [Technologies](#technologies)
  - [Tests](#tests)
  - [Contribuer](#contribuer)
  - [Licence](#licence)

---

## Présentation

Cette application permet aux agents SONABEL de gérer leurs demandes de congés, consulter leur solde en terme de congés pris ou restant, et aux administrateurs de valider et suivre les demandes.

## Fonctionnalités

- Authentification 
- Demande de congé 
- Validation des demandes par l’administration
- Historique des congés
- Tableau de bord personnalisé


## Architecture

- **Backend** : Spring Boot REST API
- **Frontend** : Vite, HTML, CSS, JavaScript, TailwindCSS

```
backend/
frontend/
laucher/ Non utilisé actuellement
```

## Installation

### Prérequis

- Java 17+
- Node.js 18+
- Maven

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Utilisation

Accédez à l’application via `http://localhost:5173` (frontend) et l’API sur `http://localhost:9090` (backend).

## Captures d’écran

Ajoutez ici vos captures d’écran pour illustrer l’interface et les fonctionnalités :

  <img width="1366" height="768" alt="Login" src="https://github.com/user-attachments/assets/756778c5-d1f7-4dae-8196-4b18ad39a2a3" />

- - ![Register](./screens/Register.png)
- ![Dashboard](./screens/Dashboard.png)
- ![AjouterAgent](./screens/AjouterAgent.png)
- ![Demande de congé0](./screens/demandeConge0.png)
- ![Demande de congé1](./screens/demandeConge1.png)
- ![Demande de congé2](./screens/demandeConge2.png)

## Technologies

- Spring Boot
- Vite
- TailwindCSS
- JavaScript
- HTML/CSS

## Tests

- Backend : JUnit, Spring Test
- Frontend : (à compléter si tu as des tests)

## Contribuer

Les contributions sont les bienvenues ! Merci de suivre les conventions de code et d’ajouter des tests pour toute nouvelle fonctionnalité.

## Licence

Ce projet est sous licence MIT.
