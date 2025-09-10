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
    private final NumeroCentre numeroCentre;


    // Total de tous les agents | Total des conges en cours | Total des conges termines
    public DashboardDTO getDashboardStats(){
        System.out.println("NumCentre Avant AgentRepo = " + numeroCentre.getNumCentre());
        long totalAgents = agentRepository.countByCentre(numeroCentre.getNumCentre());
        System.out.println("NumCentre apres AgentRepo--avant conge en cours = " + numeroCentre.getNumCentre());
        long congesEnCours = congeRepository.countCongesEnCours(numeroCentre.getNumCentre());
        long congesTermines = congeRepository.countCongesTermines(numeroCentre.getNumCentre());
        return new DashboardDTO(totalAgents, congesEnCours, congesTermines);
    }

    // Liste des Agent
    public List<AgentSummaryDTO> getListeAgents(){
        return agentRepository.agentSummary(numeroCentre.getNumCentre());
    }

    // Rechercher agents par nom ou prénom
    public List<AgentSummaryDTO> searchAgents(String keyword) {
        return agentRepository.searchAgentByNomOrPrenom(keyword, numeroCentre.getNumCentre());
    }
}
