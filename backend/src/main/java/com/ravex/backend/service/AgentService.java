package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.AgentCongeDTO; // Importer le nouveau DTO
import com.ravex.backend.dto.AgentNomPrenomDTO;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AgentService {
    private final CongeRepository congeRepository;
    private final AgentRepository agentRepository;

    public AgentService(CongeRepository congeRepository, AgentRepository agentRepository) {
        this.congeRepository = congeRepository;
        this.agentRepository = agentRepository;
    }

    // Retourner à la fois l'agent et le nombre de jours
    public Optional<AgentCongeDTO> getAgentAndJoursByCongeReference(String refConge){
        Optional<Conge> conge = congeRepository.findByReference(refConge);

        // Si le congé est trouvé, on retourne l'agent et les jours
        return conge.map(c -> {
            Agent agent = c.getAgent();
            Integer jours = c.getJours();
            return new AgentCongeDTO(agent, jours);
        });
    }

    // Obtenir le nom et le prénom de l'agent
    public Optional<AgentNomPrenomDTO> getNomPrenomViaMatricule(String matricule){
        return agentRepository.obtenirNomEtPrenomAgentViaMatricule(matricule);
    }

}