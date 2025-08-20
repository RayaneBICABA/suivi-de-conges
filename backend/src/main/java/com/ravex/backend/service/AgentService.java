package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.AgentCongeDTO; // Importer le nouveau DTO
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AgentService {
    private final CongeRepository congeRepository;

    public AgentService(CongeRepository congeRepository) {
        this.congeRepository = congeRepository;
    }

    // Modifier pour retourner à la fois l'agent et le nombre de jours
    public Optional<AgentCongeDTO> getAgentAndJoursByCongeReference(String refConge){
        Optional<Conge> conge = congeRepository.findByReference(refConge);

        // Si le congé est trouvé, on retourne l'agent et les jours
        return conge.map(c -> {
            Agent agent = c.getAgent();
            Integer jours = c.getJours();
            return new AgentCongeDTO(agent, jours);
        });
    }
}