package com.ravex.backend.Controller;

import com.ravex.backend.domain.Repository.UtilisateurRepository;
import com.ravex.backend.domain.model.Direction;
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
    private DirectionDto convertToDirectionDto(Direction direction) {
        if (direction == null) return null;
        return new DirectionDto(direction.getNumero(), direction.getNom());
    }

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
            Direction direction = new Direction();
            direction.setNumero(request.getDirectionDto().numero());
            direction.setNom(request.getDirectionDto().nom());
            utilisateur.setDirection(direction);

            Utilisateur savedUser = utilisateurService.saveUser(utilisateur);

            // Générer token JWT avec les informations de direction
            String token = JwtUtil.generateToken(
                    savedUser.getEmail(),
                    savedUser.getDirection().getNumero(),
                    savedUser.getDirection().getNom()
            );

            DirectionDto directionDto = convertToDirectionDto(savedUser.getDirection());

            return ResponseEntity.ok(new AuthResponse(token,
                    new UtilisateurDTO(savedUser.getFirstname(),
                            savedUser.getLastname(),
                            savedUser.getEmail(),
                            directionDto)));

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

            // Générer token JWT avec les informations de direction
            String token = JwtUtil.generateToken(
                    utilisateur.getEmail(),
                    utilisateur.getDirection().getNumero(),
                    utilisateur.getDirection().getNom()
            );

            // Réponse avec token et infos utilisateur incluant la direction
            DirectionDto directionDto = new DirectionDto(
                    utilisateur.getDirection().getNumero(),
                    utilisateur.getDirection().getNom()
            );

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    new UtilisateurDTO(
                            utilisateur.getFirstname(),
                            utilisateur.getLastname(),
                            utilisateur.getEmail(),
                            directionDto // ✅ DirectionDto
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
            DirectionDto direction = JwtUtil.getDirectionFromToken(request.getToken());

            // Token valide si aucune exception
            return ResponseEntity.ok(new TokenVerificationResponse(
                    "Token valide",
                    email,
                    direction
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("Token invalide ou expiré"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse("Token d'authentification manquant"));
            }

            String email = JwtUtil.getEmailFromToken(token);
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);

            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);
            if (utilisateurOpt.isEmpty()) {
                return ResponseEntity.status(404)
                        .body(new ApiResponse("Utilisateur non trouvé"));
            }

            Utilisateur utilisateur = utilisateurOpt.get();
            return ResponseEntity.ok(new UtilisateurDTO(
                    utilisateur.getFirstname(),
                    utilisateur.getLastname(),
                    utilisateur.getEmail(),
                    direction
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("Token invalide ou expiré"));
        }
    }
}