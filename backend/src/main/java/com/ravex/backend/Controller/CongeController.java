package com.ravex.backend.Controller;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.NouveauCongeDTO;
import com.ravex.backend.service.CongeService;
import com.ravex.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/conge")
@RequiredArgsConstructor
public class CongeController {
    
    private final CongeService congeService;
    private final AgentRepository agentRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/checkRef")
    public ResponseEntity<String> checkerSiRefExite(
            @RequestParam int refNumber,
            @RequestParam int year,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = jwtUtil.extractTokenFromHeader(authHeader);
            DirectionDto direction = jwtUtil.getDirectionFromToken(token);
            String reference = refNumber + "/DRH/" + year;
            
            if (congeService.voirSiRefCongeExiste(reference, direction.numero())) {
                return ResponseEntity.ok("La référence existe : " + reference);
            } else {
                return ResponseEntity.status(404).body("La référence n'existe pas : " + reference);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la vérification de la référence: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Erreur interne du serveur");
        }
    }

    @PostMapping
    public ResponseEntity<?> ajouterConge(
            @RequestBody NouveauCongeDTO dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            log.info("Tentative de création de congé avec référence: {}", dto.getReference());

            if (dto.getReference() == null || dto.getReference().trim().isEmpty()) {
                return createErrorResponse("La référence est obligatoire");
            }
            
            if (dto.getMatriculeAgent() == null || dto.getMatriculeAgent().trim().isEmpty()) {
                return createErrorResponse("Le matricule de l'agent est obligatoire");
            }
            
            if (dto.getJours() == null || dto.getJours() <= 0) {
                return createErrorResponse("Le nombre de jours doit être supérieur à 0");
            }

            String token = jwtUtil.extractTokenFromHeader(authHeader);
            DirectionDto direction = jwtUtil.getDirectionFromToken(token);

            if (congeService.voirSiRefCongeExiste(dto.getReference(), direction.numero())) {
                return createErrorResponse("Un congé avec cette référence existe déjà : " + dto.getReference());
            }

            Optional<Agent> agentOpt = agentRepository.findByMatriculeTrimmed(dto.getMatriculeAgent(), direction.numero());
            if (agentOpt.isEmpty()) {
                return createErrorResponse("Agent introuvable avec matricule : " + dto.getMatriculeAgent());
            }

            Conge conge = Conge.builder()
                    .reference(dto.getReference())
                    .jours(dto.getJours())
                    .agent(agentOpt.get())
                    .build();

            Conge saved = congeService.enregistrerConge(conge, direction.numero());
            log.info("Congé créé avec succès - Référence: {}", saved.getReference());
            
            return ResponseEntity.ok(saved);
            
        } catch (DataIntegrityViolationException e) {
            log.error("Violation de contrainte d'intégrité: {}", e.getMessage(), e);
            String message = "Un congé avec cette référence existe déjà ou violation de contrainte";
            if (e.getMessage().contains("reference")) {
                message = "Un congé avec cette référence existe déjà";
            } else if (e.getMessage().contains("agent")) {
                message = "Cet agent a déjà un congé en cours";
            }
            return createErrorResponse(message);
            
        } catch (IllegalArgumentException e) {
            log.error("Argument invalide: {}", e.getMessage(), e);
            return createErrorResponse("Données invalides: " + e.getMessage());
            
        } catch (Exception e) {
            log.error("Erreur lors de la création du congé: {}", e.getMessage(), e);
            return createErrorResponse("Erreur interne lors de la création du congé: " + e.getMessage());
        }
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(400).body(errorResponse);
    }
}