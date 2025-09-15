package com.ravex.backend.Controller;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentCongeDTO;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.centre.SaveAgentDto;
import com.ravex.backend.service.AgentService;
import com.ravex.backend.util.JwtUtil;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    // ✅ CORRECTION : Ajouter extraction de la direction depuis le token JWT
    @GetMapping("/byConge")
    public ResponseEntity<?> getAgentByConge(
            @RequestParam String ref,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraire le token et la direction
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

            // Appeler la méthode avec directionNumero
            Optional<AgentCongeDTO> agentCongeDTO = agentService.getAgentAndJoursByCongeReference(ref, directionNumero);

            if (agentCongeDTO.isPresent()) {
                return ResponseEntity.ok(agentCongeDTO.get());
            } else {
                return ResponseEntity.status(404).body("Aucun agent trouvé pour le congé : " + ref);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ CORRECTION : Ajouter extraction de la direction depuis le token JWT
    @GetMapping("/nomPrenom")
    public ResponseEntity<?> getNomPrenomAgent(
            @RequestParam String matricule,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraire le token et la direction
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

            // Appeler la méthode avec directionNumero
            Optional<AgentNomPrenomDTO> agentNomPrenomDTO = agentService.getNomPrenomViaMatricule(matricule, directionNumero);

            if (agentNomPrenomDTO.isPresent()) {
                return ResponseEntity.ok(agentNomPrenomDTO.get());
            } else {
                return ResponseEntity.status(404).body("Aucun agent trouvé avec le matricule: " + matricule);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ PAS DE CHANGEMENT : addAgent n'a plus besoin de directionNumero (le centre suffit)
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addAgent(@RequestBody SaveAgentDto centreDto) {
        try {
            // Sauvegarde (pas besoin de directionNumero, le centre contient sa direction)
            Agent savedAgent = agentService.addAgent(centreDto);

            return ResponseEntity.ok(Map.of(
                    "message", "Agent enregistré avec succès",
                    "matricule", savedAgent.getMatricule(),
                    "nom", savedAgent.getNom(),
                    "prenom", savedAgent.getPrenom(),
                    "fonction", savedAgent.getFonction()
            ));

        } catch (Exception e) {
            // Gérer les exceptions métier (ex: matricule déjà existant)
            return ResponseEntity.status(409).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
}