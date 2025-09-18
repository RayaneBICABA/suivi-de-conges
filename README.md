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

  <img width="1366" height="768" alt="Register" src="https://github.com/user-attachments/assets/215a0588-d02e-49e4-bb1d-963e672feaf8" />

  <img width="1366" height="768" alt="Dashboard" src="https://github.com/user-attachments/assets/40668ca1-525d-44a2-959e-e0395e49abe3" />

  <img width="1366" height="768" alt="AjouterAgent" src="https://github.com/user-attachments/assets/79bee7e1-2360-41e8-a7e2-687aaa3a6e0d" />

  <img width="1366" height="768" alt="demandeConge0" src="https://github.com/user-attachments/assets/1a4ceafc-a65e-412a-b73a-97d56e709de0" />

  <img width="1366" height="768" alt="demandeConge1" src="https://github.com/user-attachments/assets/314781b9-5dca-47cf-b4d1-1f872f2f53c0" />

  <img width="1366" height="768" alt="demandeConge2" src="https://github.com/user-attachments/assets/3291a5a7-386f-42ac-8baf-4fbfb1ee9199" />




## Technologies

- Spring Boot
- Vite
- TailwindCSS
- JavaScript
- HTML/CSS

## Tests

- Backend : JUnit, Spring Test


## Contribuer

Les contributions sont les bienvenues ! Merci de suivre les conventions de code et d’ajouter des tests pour toute nouvelle fonctionnalité.

