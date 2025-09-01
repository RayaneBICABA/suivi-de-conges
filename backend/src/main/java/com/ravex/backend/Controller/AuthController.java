package com.ravex.backend.Controller;

import com.ravex.backend.domain.Repository.UtilisateurRepository;
import com.ravex.backend.domain.model.Utilisateur;
import com.ravex.backend.dto.*;
import com.ravex.backend.service.UtilisateurService;
import com.ravex.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurService utilisateurService;
    private final UtilisateurRepository utilisateurRepository; 

    public AuthController(UtilisateurService utilisateurService, UtilisateurRepository utilisateurRepository) {
        this.utilisateurService = utilisateurService;
        this.utilisateurRepository = utilisateurRepository; 
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        // Vérifier les erreurs de validation
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            bindingResult.getFieldErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()).append(". "));
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(errorMsg.toString().trim()));
        }

        try {
            // Vérifier si l'email existe déjà
            Optional<Utilisateur> existingUser = utilisateurRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Email déjà utilisé"));
            }

            // Créer nouvel utilisateur
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setUsername(request.getUsername());
            utilisateur.setFirstname(request.getFirstname());
            utilisateur.setLastname(request.getLastname());
            utilisateur.setEmail(request.getEmail());
            utilisateur.setPassword(request.getPassword());

            Utilisateur savedUser = utilisateurService.saveUser(utilisateur);

            // Générer token JWT
            String token = JwtUtil.generateToken(savedUser.getEmail());

            return ResponseEntity.ok(new AuthResponse(token,
                    new UtilisateurDTO(savedUser.getFirstname(),
                            savedUser.getLastname(),
                            savedUser.getEmail())));

        } catch (Exception e) {
            e.printStackTrace(); // Pour debug
            return ResponseEntity.status(500)
                    .body(new ApiResponse("Erreur serveur lors de l'inscription"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, BindingResult bindingResult) {
        // Vérifier les erreurs de validation
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            bindingResult.getFieldErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()).append(". "));
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(errorMsg.toString().trim()));
        }

       try {
    // Authentification
    Optional<Utilisateur> utilisateurOpt = utilisateurService.authenticate(
            request.getEmail(),
            request.getPassword());

    if (utilisateurOpt.isEmpty()) {
        return ResponseEntity.status(401)
                .body(new ApiResponse("Email ou mot de passe incorrect"));
    }

    Utilisateur utilisateur = utilisateurOpt.get();

    if (!utilisateur.isEnabled()) {
        return ResponseEntity.status(403) // 403 Forbidden est plus approprié pour un compte désactivé
                .body(new ApiResponse("Compte désactivé"));
    }

    // Générer token JWT
    String token = JwtUtil.generateToken(utilisateur.getEmail());

    // Réponse avec token et infos utilisateur
    return ResponseEntity.ok(new AuthResponse(
            token,
            new UtilisateurDTO(
                    utilisateur.getFirstname(),
                    utilisateur.getLastname(),
                    utilisateur.getEmail()
            )
    ));

} catch (Exception e) {
    e.printStackTrace(); // Pour debug
    return ResponseEntity.status(500)
            .body(new ApiResponse("Erreur serveur lors de la connexion"));
}

    }

    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@Valid @RequestBody TokenRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Token manquant"));
        }

        try {
            String email = JwtUtil.getEmailFromToken(request.getToken());
            // Token valide si aucune exception
            return ResponseEntity.ok(new ApiResponse("Token valide"));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("Token invalide ou expiré"));
        }
    }
}