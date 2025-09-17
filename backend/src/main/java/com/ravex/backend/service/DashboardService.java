package com.ravex.backend.service;

import com.ravex.backend.configuration.NumeroCentre;
import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import com.ravex.backend.dto.dashboard.DashboardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final AgentRepository agentRepository;
    private final CongeRepository congeRepository;

    public DashboardDTO getDashboardStats(Long directionNumero){
        long totalAgents = agentRepository.countByDirection(directionNumero);
        long congesEnCours = congeRepository.countCongesEnCours(directionNumero);
        long congesTermines = congeRepository.countCongesTermines(directionNumero);
        return new DashboardDTO(totalAgents, congesEnCours, congesTermines);
    }

    public List<AgentSummaryDTO> getListeAgents(Long directionNumero){
        return agentRepository.agentSummaryByDirection(directionNumero);
    }

    public List<AgentSummaryDTO> searchAgents(String keyword, Long directionNumero) {
        return agentRepository.searchAgentByNomOrPrenom(keyword, directionNumero);
    }
}
