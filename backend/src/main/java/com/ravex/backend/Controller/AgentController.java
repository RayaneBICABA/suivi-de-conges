package com.ravex.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentCongeDTO; // Importer le DTO
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.service.AgentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    // Endpoint : GET /agent/byConge?ref=123/DRH/2025
    // Modifiez la méthode pour qu'elle renvoie le DTO AgentCongeDTO
    @GetMapping("/byConge")
    public ResponseEntity<?> getAgentByConge(@RequestParam String ref){
        Optional<AgentCongeDTO> agentCongeDTO = agentService.getAgentAndJoursByCongeReference(ref);

        if(agentCongeDTO.isPresent()){
            // Si le DTO est présent, renvoyez-le avec un statut OK
            return ResponseEntity.ok(agentCongeDTO.get());
        } else {
            // Sinon, renvoyez une réponse 404 (Not Found)
            return ResponseEntity.status(404).body("Aucun agent trouvé pour le congé : " + ref);
        }
    }

    // Endpoint : GET /agent/nomPrenom?matricule=AGT123
    @GetMapping("/nomPrenom")
    public ResponseEntity<?> getNomPrenomAgent(@RequestParam String matricule) {
        Optional <AgentNomPrenomDTO> agentNomPrenomDTO = agentService.getNomPrenomViaMatricule(matricule);
        if(agentNomPrenomDTO.isPresent()){
            return ResponseEntity.ok(agentNomPrenomDTO.get());
        }else{
            return ResponseEntity.status(404).body("Aucun agent trouvé avec le matricule: "+matricule);
        }
    }

    // Endpoint : POST /agent
    // SOLUTION : Retirer complètement la contrainte consumes pour être plus permissif
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addAgent(@RequestBody Agent agent) {
        try {
            // Validation
            if (agent.getMatricule() == null || agent.getMatricule().trim().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Le matricule est obligatoire"));
            if (agent.getNom() == null || agent.getNom().trim().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Le nom est obligatoire"));
            if (agent.getPrenom() == null || agent.getPrenom().trim().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Le prénom est obligatoire"));
            if (agent.getFonction() == null || agent.getFonction().trim().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "La fonction est obligatoire"));

            // Sauvegarde
            Agent savedAgent = agentService.addAgent(agent);

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