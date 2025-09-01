package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import com.ravex.backend.dto.dashboard.DashboardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final AgentRepository agentRepository;
    private final CongeRepository congeRepository;

    // Total de tous les agents | Total des conges en cours | Total des conges termines
    public DashboardDTO getDashboardStats(){
        long totalAgents = agentRepository.count();
        long congesEnCours = congeRepository.countCongesEnCours();
        long congesTermines = congeRepository.countCongesTermines();
        return new DashboardDTO(totalAgents, congesEnCours, congesTermines);
    }

    // Liste des Agent
    public List<AgentSummaryDTO> getListeAgents(){
        return agentRepository.agentSummary();
    }

    // Rechercher agents par nom ou prénom
    public List<AgentSummaryDTO> searchAgents(String keyword) {
        return agentRepository.searchAgentByNomOrPrenom(keyword);
    }
}
