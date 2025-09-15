package com.ravex.backend.Controller;

import com.ravex.backend.domain.model.SuiviConge;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.SuiviCongeCreateRequest;
import com.ravex.backend.service.SuiviCongeService;
import com.ravex.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/suivi-conge")
@RequiredArgsConstructor
public class SuiviCongeController {

    private final SuiviCongeService suiviCongeService;

    // Enregistrer un nouveau suivi de congé
    @PostMapping
    public ResponseEntity<?> createSuivi(
            @RequestBody SuiviCongeCreateRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Récupérer la direction depuis le JWT
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);

            // Passer directionNumero au service
            SuiviConge suivi = suiviCongeService.create(request, direction.numero());
            return ResponseEntity.ok(suivi);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", e.getMessage()
            ));
        }
    }

    // Retourner le nombre de jours restants pour un congé donné
    @GetMapping("/jours-restants")
    public ResponseEntity<?> getJoursRestants(
            @RequestParam String reference,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Récupérer la direction depuis le JWT
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);

            int joursRestants = suiviCongeService.calculerJoursRestants(reference, direction.numero());
            return ResponseEntity.ok(Map.of("joursRestants", joursRestants));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", e.getMessage()
            ));
        }
    }
}
