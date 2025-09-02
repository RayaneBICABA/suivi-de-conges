package com.ravex.backend.Controller;

import com.ravex.backend.dto.AgentDetailsDTO;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import com.ravex.backend.dto.dashboard.DashboardDTO;
import com.ravex.backend.service.AgentService;
import com.ravex.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final AgentService agentService;

    // Total agents, Total Conges en cours, Total conges termines
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashBoardStat(){
        try{
            DashboardDTO data = dashboardService.getDashboardStats();
            return ResponseEntity.ok(data);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    // Liste des Agents
    @GetMapping("/agents")
    public ResponseEntity<List<AgentSummaryDTO>> getListeAgents(){
        try{
            List<AgentSummaryDTO> data = dashboardService.getListeAgents();
            return ResponseEntity.ok(data);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    // Rechercher des agents par nom ou prénom
    @GetMapping("/agents/search")
    public ResponseEntity<List<AgentSummaryDTO>> searchAgents(@RequestParam("keyword") String keyword) {
        try {
            List<AgentSummaryDTO> results = dashboardService.searchAgents(keyword);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{matricule}/details")
    public ResponseEntity<AgentDetailsDTO> getAgentDetails(@PathVariable String matricule) {
        try {
            Optional<AgentDetailsDTO> agentDetails = agentService.getAgentDetails(matricule);

            if (agentDetails.isPresent()) {
                return ResponseEntity.ok(agentDetails.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
