package com.ravex.backend.Controller;

// package com.ravex.backend.Controller;
import com.ravex.backend.domain.model.SuiviConge;
import com.ravex.backend.dto.SuiviCongeCreateRequest;
import com.ravex.backend.service.SuiviCongeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/suivi-conge")
public class SuiviCongeController {
    private final SuiviCongeService suiviCongeService;

    public SuiviCongeController(SuiviCongeService suiviCongeService) {
        this.suiviCongeService = suiviCongeService;
    }

    // Enregistrer un nouveau suivi de congé
    @PostMapping
    public ResponseEntity<?> createSuivi(@RequestBody SuiviCongeCreateRequest request) {
        try {
            SuiviConge saved = suiviCongeService.create(request);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", e.getMessage()
            ));
        }
    }

    // Retourner le nombre de jours restants pour un congé donné
    // ✅ Utiliser query param pour gérer les / dans la référence
    // Endpoint dédié pour les jours restants
    @GetMapping("/jours-restants")
    public ResponseEntity<?> getJoursRestants(@RequestParam String reference) {
        try {
            int joursRestants = suiviCongeService.calculerJoursRestants(reference);
            return ResponseEntity.ok(Map.of("joursRestants", joursRestants));
        } catch (IllegalArgumentException e) {
            // référence introuvable
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            // autre erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", e.getMessage()
            ));
        }
    }
}


