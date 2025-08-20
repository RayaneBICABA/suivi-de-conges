package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AgentService {
    private final CongeRepository congeRepository;

    public AgentService(CongeRepository congeRepository) {
        this.congeRepository = congeRepository;
    }

    // Collecter infos agent à partir de la référence du congé
    public Optional<Agent> getAgentByCongeReference(String refConge){
        Optional<Conge> conge = congeRepository.findByReference(refConge);
        return conge.map(Conge::getAgent); // si trouvé, renvoie l’agent associé
    }
}
