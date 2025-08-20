package com.ravex.backend.Controller;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    // Endpoint : GET /agent/byConge?ref=123/DRH/2025
    @GetMapping("/byConge")
    public ResponseEntity<?> getAgentByConge(@RequestParam String ref){
        Optional<Agent> agent = agentService.getAgentByCongeReference(ref);

        if(agent.isPresent()){
            return ResponseEntity.ok(agent.get());
        } else {
            return ResponseEntity.status(404).body("Aucun agent trouvé pour le congé : " + ref);
        }
    }

}   
