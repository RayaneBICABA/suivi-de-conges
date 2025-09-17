package com.ravex.backend.Controller;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentCongeDTO;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.centre.SaveAgentDto;
import com.ravex.backend.service.AgentService;
import com.ravex.backend.util.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;
    private final JwtUtil jwtUtil; 

    @GetMapping("/byConge")
    public ResponseEntity<?> getAgentByConge(
            @RequestParam String ref,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtUtil.extractTokenFromHeader(authHeader);;
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = jwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

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

    @GetMapping("/nomPrenom")
    public ResponseEntity<?> getNomPrenomAgent(
            @RequestParam String matricule,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = jwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

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

@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> addAgent(@RequestBody SaveAgentDto agentDto) {
    try {
        Agent savedAgent = agentService.addAgent(agentDto);
        return ResponseEntity.ok(Map.of(
                "message", "Agent enregistré avec succès",
                "matricule", savedAgent.getMatricule(),
                "nom", savedAgent.getNom(),
                "prenom", savedAgent.getPrenom(),
                "fonction", savedAgent.getFonction()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(409).body(Map.of(
                "message", e.getMessage()
        ));
    }
}


}