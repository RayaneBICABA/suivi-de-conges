# API de Suivi de Congés SONABEL

## 🔐 Identifiants de Connexion Spring Security

Votre application utilise Spring Security avec authentification basique. Voici les identifiants configurés :

### Comptes Utilisateurs Disponibles

| Utilisateur | Mot de passe | Rôle | Description |
|-------------|--------------|------|-------------|
| `admin` | `admin123` | ADMIN | Administrateur système |
| `user` | `user123` | USER | Utilisateur standard |
| `sonabel` | `sonabel2024` | ADMIN | Compte spécifique SONABEL |

### 🚀 Comment utiliser les identifiants

#### 1. **Avec Postman**
- Dans l'onglet **Authorization**
- Sélectionnez **Basic Auth**
- Username: `admin` (ou un autre compte)
- Password: `admin123` (ou le mot de passe correspondant)

#### 2. **Avec curl**
```bash
curl -u admin:admin123 http://localhost:8080/api/agents
```

#### 3. **Avec un navigateur**
- Accédez à: `http://localhost:8080/api/agents`
- Une popup d'authentification apparaîtra
- Entrez: `admin` / `admin123`

#### 4. **Swagger UI**
- Accédez à: `http://localhost:8080/swagger-ui.html`
- Cliquez sur **Authorize**
- Entrez les identifiants dans Basic Auth

## 📋 Configuration Actuelle

### Sécurité
- **Type**: Basic Authentication (HTTP Basic)
- **Session**: Stateless (pas de session)
- **CORS**: Activé pour tous les domaines
- **CSRF**: Désactivé (pour les API REST)

### Endpoints Publics (sans authentification)
- `/swagger-ui/**` - Documentation Swagger
- `/v3/api-docs/**` - Spécification OpenAPI
- `/api/**` - **TOUS les endpoints API sont actuellement publics pour le développement**

## 🛠️ Démarrage de l'Application

1. **Démarrer l'application**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Vérifier que l'application fonctionne**
   ```bash
   curl http://localhost:8080/api/agents
   ```

3. **Accéder à la documentation**
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - OpenAPI JSON: http://localhost:8080/v3/api-docs

## 🔧 Modification de la Configuration de Sécurité

### Pour désactiver complètement la sécurité (développement uniquement)
Dans `SecurityConfig.java`, remplacez la configuration par :
```java
.authorizeHttpRequests(authz -> authz.anyRequest().permitAll())
```

### Pour activer l'authentification sur tous les endpoints
Dans `SecurityConfig.java`, remplacez par :
```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
    .anyRequest().authenticated()
)
```

### Pour ajouter de nouveaux utilisateurs
Dans `SecurityConfig.java`, ajoutez dans la méthode `userDetailsService()` :
```java
UserDetails nouveauUser = User.builder()
        .username("nouveau_user")
        .password(passwordEncoder().encode("mot_de_passe"))
        .roles("USER")
        .build();
```

## 📊 Base de Données

### Configuration Oracle
- **URL**: `jdbc:oracle:thin:@192.168.40.210:1521:etude`
- **Username**: `et`
- **Password**: `et123`
- **Driver**: Oracle JDBC Driver

### Tables Créées Automatiquement
- `AGENT` - Informations des agents
- `CONGE` - Congés accordés
- `SUIVI_CONGE` - Suivi des prises de congés

## 🧪 Tests avec Postman

1. **Importer la collection**
   - Importez le fichier `openapi.yaml` dans Postman
   - Ou utilisez l'URL: `http://localhost:8080/v3/api-docs`

2. **Configurer l'authentification**
   - Dans la collection, onglet **Authorization**
   - Type: **Basic Auth**
   - Username: `admin`
   - Password: `admin123`

3. **Tester les endpoints**
   - GET `/api/agents` - Liste des agents
   - POST `/api/agents` - Créer un agent
   - POST `/api/conges` - Créer un congé
   - POST `/api/suivi-conges` - Enregistrer une prise de congé

## 🔍 Logs et Débogage

Les logs sont configurés en mode DEBUG pour :
- `com.ravex.backend` - Votre application
- `org.springframework.security` - Spring Security
- `org.springframework.web` - Requêtes web

Consultez la console pour voir les détails des authentifications et requêtes.

## 📝 Notes Importantes

1. **Sécurité en Production**: Changez les mots de passe par défaut avant la mise en production
2. **HTTPS**: Utilisez HTTPS en production pour sécuriser les identifiants
3. **JWT**: Pour une API REST moderne, considérez l'implémentation de JWT au lieu de Basic Auth
4. **Base de données**: Les utilisateurs sont actuellement en mémoire, considérez une base de données pour la production

## 🆘 Dépannage

### Problème d'authentification
- Vérifiez que vous utilisez les bons identifiants
- Consultez les logs pour voir les tentatives d'authentification
- Assurez-vous que l'en-tête Authorization est correctement formaté

### Erreur CORS
- La configuration CORS est permissive pour le développement
- En production, limitez les origines autorisées

### Problème de base de données
- Vérifiez la connectivité à Oracle
- Consultez les logs Hibernate pour les erreurs SQL