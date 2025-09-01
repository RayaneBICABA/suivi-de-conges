package com.ravex.backend.Controller;

import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import com.ravex.backend.dto.dashboard.DashboardDTO;
import com.ravex.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

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
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
