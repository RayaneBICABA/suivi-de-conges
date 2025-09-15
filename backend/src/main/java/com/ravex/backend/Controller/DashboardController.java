package com.ravex.backend.Controller;

import com.ravex.backend.dto.AgentDetailsDTO;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import com.ravex.backend.dto.dashboard.DashboardDTO;
import com.ravex.backend.service.AgentService;
import com.ravex.backend.service.DashboardService;
import com.ravex.backend.util.JwtUtil;
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
    public ResponseEntity<DashboardDTO> getDashBoardStat(@RequestHeader("Authorization") String authHeader){
        try{
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();


            DashboardDTO data = dashboardService.getDashboardStats(directionNumero);
            return ResponseEntity.ok(data);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }


    // Liste des Agents
    @GetMapping("/agents")
    public ResponseEntity<List<AgentSummaryDTO>> getListeAgents(@RequestHeader("Authorization") String authHeader){
        try{
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

            List<AgentSummaryDTO> data = dashboardService.getListeAgents(directionNumero);
            return ResponseEntity.ok(data);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    // Rechercher des agents par nom ou prénom
    @GetMapping("/agents/search")
    public ResponseEntity<List<AgentSummaryDTO>> searchAgents(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("keyword") String keyword) {
        try {
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

            List<AgentSummaryDTO> results = dashboardService.searchAgents(keyword, directionNumero);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{matricule}/details")
    public ResponseEntity<AgentDetailsDTO> getAgentDetails(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String matricule) {
        try {
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            DirectionDto direction = JwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();

            // Optionnel : s'assurer que l'agent appartient à la même direction avant d'afficher
            Optional<AgentDetailsDTO> agentDetails = agentService.getAgentDetails(matricule, directionNumero);

            if (agentDetails.isPresent()) {
                return ResponseEntity.ok(agentDetails.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
