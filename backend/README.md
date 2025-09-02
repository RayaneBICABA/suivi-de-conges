# 📚 API REST Suivi de Congés SONABEL

Bienvenue dans la documentation de l’API backend pour le suivi des congés des agents SONABEL. Cette API, développée avec Spring Boot, permet la gestion des agents, des congés, du suivi des prises de congés, ainsi que l’authentification des utilisateurs.

---

## 🚀 Démarrage rapide

### Prérequis

- Java 17+
- Maven

### Installation & Lancement

```bash
./mvnw spring-boot:run
```

L’application démarre sur [http://localhost:8080](http://localhost:8080).

---

## 🛠️ Structure du projet

- `src/main/java/com/ravex/backend/Controller/` : Contrôleurs REST
- `src/main/java/com/ravex/backend/service/` : Services métier
- `src/main/java/com/ravex/backend/domain/model/` : Entités JPA
- `src/main/java/com/ravex/backend/domain/Repository/` : Repositories Spring Data JPA
- `src/main/java/com/ravex/backend/dto/` : DTOs pour les échanges API
- `src/main/resources/application.properties` : Configuration de l’application

---

## 🔐 Authentification & Sécurité

- Authentification par JWT (JSON Web Token)
- Endpoints d’inscription, connexion, vérification de token
- Exemple d’utilisation du token :  
  Ajoute l’en-tête `Authorization: Bearer <token>` à tes requêtes.

Endpoints principaux :
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `POST /api/auth/verify-token` : Vérification du token

---

## 📦 Endpoints principaux

### Agents

- `GET /agent/byConge?ref=...`  
  Récupère l’agent et le nombre de jours attribués pour un congé donné.

- `GET /agent/nomPrenom?matricule=...`  
  Récupère le nom et le prénom d’un agent via son matricule.

- `POST /agent`  
  Ajoute un nouvel agent.

### Congés

- `GET /conge/checkRef?refNumber=...&year=...`  
  Vérifie si une référence de congé existe.

- `POST /conge`  
  Ajoute un nouveau congé pour un agent.

### Suivi des congés

- `POST /suivi-conge`  
  Enregistre une prise de congé (suivi).

- `GET /suivi-conge/jours-restants?reference=...`  
  Retourne le nombre de jours restants pour une référence de congé.

### Dashboard

- `GET /dashboard`  
  Statistiques globales (total agents, congés en cours, terminés).

- `GET /dashboard/agents`  
  Liste des agents.

- `GET /dashboard/agents/search?keyword=...`  
  Recherche d’agents par nom ou prénom.

- `GET /dashboard/{matricule}/details`  
  Détails complets d’un agent (congés, suivis, jours restants).

---

## 📑 Modèles de données

### Agent

```json
{
  "matricule": "A12345",
  "nom": "Doe",
  "prenom": "John",
  "fonction": "Développeur"
}
```

### Congé

```json
{
  "reference": "123/DRH/2025",
  "jours": 30,
  "matriculeAgent": "A12345"
}
```

### Suivi de Congé

```json
{
  "matricule": "A12345",
  "congeRef": "123/DRH/2025",
  "dateDebut": "2025-07-01",
  "dateFin": "2025-07-10"
}
```

---

## 🧑‍💻 Exemples d’utilisation

### Inscription

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "jdoe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@sonabel.bf",
  "password": "monmotdepasse123"
}
```

### Connexion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@sonabel.bf",
  "password": "monmotdepasse123"
}
```

### Ajouter un agent

```http
POST /agent
Content-Type: application/json

{
  "matricule": "A12345",
  "nom": "Doe",
  "prenom": "John",
  "fonction": "Développeur"
}
```

---

## 🛡️ Sécurité

- CORS activé pour tous les domaines (modifiable dans [`CorsConfig`](src/main/java/com/ravex/backend/configuration/CorsConfig.java))
- CSRF désactivé (API REST)
- Les mots de passe sont hashés avec BCrypt

---

## 🗄️ Base de données

- Support Oracle et MySQL (voir [`application.properties`](src/main/resources/application.properties))
- Tables principales : `AGENT`, `CONGE`, `SUIVI_CONGE`, `UTILISATEUR`

---

## 📖 Documentation OpenAPI / Swagger

- Swagger UI disponible sur [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Spécification OpenAPI : [openapi.yaml](openapi.yaml)

---

## 🧪 Tests

- Tests unitaires avec JUnit (voir [`BackendApplicationTests`](src/test/java/com/ravex/backend/BackendApplicationTests.java))

---

## 📝 Bonnes pratiques

- Change les mots de passe par défaut avant la mise en production
- Utilise HTTPS en production
- Limite les origines CORS en production

---

## 📬 Support

Pour toute question ou bug, contacte l’équipe technique SONABEL.

---

**Dernière mise à jour : Juin 2025**