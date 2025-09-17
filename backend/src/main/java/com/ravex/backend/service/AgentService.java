package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CentreRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.Repository.SuiviCongeRepository;
import com.ravex.backend.domain.Repository.DirectionRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Centre;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.domain.model.Direction;
import com.ravex.backend.dto.AgentCongeDTO;
import com.ravex.backend.dto.AgentDetailsDTO;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.dto.centre.SaveAgentDto;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgentService {
    private final CongeRepository congeRepository;
    private final AgentRepository agentRepository;
    private final SuiviCongeRepository suiviCongeRepository;
    private final CentreRepository centreRepository;
    private final DirectionRepository directionRepository;

    public Optional<AgentCongeDTO> getAgentAndJoursByCongeReference(String refConge, Long directionNumero) {
        Optional<Conge> conge = congeRepository.findByReferenceAndDirection(refConge, directionNumero);

        return conge.map(c -> {
            Agent agent = c.getAgent();
            Integer jours = c.getJours();
            return new AgentCongeDTO(agent, jours);
        });
    }

    public Optional<AgentNomPrenomDTO> getNomPrenomViaMatricule(String matricule, Long directionNumero) {
        return agentRepository.obtenirNomEtPrenomAgentViaMatricule(matricule, directionNumero);
    }

    public boolean checkerSiMatriculeExiste(String matricule, Long directionNumero) {
        return agentRepository.findByMatriculeTrimmed(matricule, directionNumero).isPresent();
    }

public Agent addAgent(SaveAgentDto dto) {
    // Récupérer le centre avec sa direction
    Centre centre = centreRepository.findById(dto.code())
            .orElseThrow(() -> new RuntimeException("Centre non trouvé"));
    
    // Vérifier que le matricule n'existe pas déjà
    if (agentRepository.existsById(dto.matricule())) {
        throw new RuntimeException("Un agent avec ce matricule existe déjà");
    }
    
    Agent agent = new Agent();
    agent.setMatricule(dto.matricule());
    agent.setNom(dto.nom());
    agent.setPrenom(dto.prenom());
    agent.setFonction(dto.fonction());
    agent.setCentre(centre);
    
    // Récupérer automatiquement la direction depuis le centre
    agent.setDirection(centre.getDirection());
    
    return agentRepository.save(agent);
}
    @Transactional(readOnly = true)
    public Optional<AgentDetailsDTO> getAgentDetails(String matricule, Long directionNumero) {
        Optional<Agent> agentOpt = agentRepository.findByMatriculeTrimmed(matricule, directionNumero);

        if (agentOpt.isEmpty()) {
            return Optional.empty();
        }

        Agent agent = agentOpt.get();
        List<AgentDetailsDTO.CongeDetailDTO> congeDetails = new ArrayList<>();

        if (agent.getConges() != null && !agent.getConges().isEmpty()) {
            for (Conge conge : agent.getConges()) {
                String annee = extractAnneeFromReference(conge.getReference());
                Integer joursConsommes = suiviCongeRepository.totaljoursEpuise(conge.getReference());
                Integer joursRestants = conge.getJours() - (joursConsommes != null ? joursConsommes : 0);

                List<AgentDetailsDTO.SuiviDetailDTO> suivis = new ArrayList<>();
                if (conge.getSuiviConge() != null) {
                    conge.getSuiviConge().forEach(suivi -> {
                        suivis.add(new AgentDetailsDTO.SuiviDetailDTO(
                                suivi.getDateDebut(),
                                suivi.getDateFin(),
                                suivi.getJours()
                        ));
                    });
                }

                congeDetails.add(new AgentDetailsDTO.CongeDetailDTO(
                        conge.getReference(),
                        conge.getJours(),
                        joursRestants,
                        annee,
                        suivis
                ));
            }
        }

        AgentDetailsDTO result = new AgentDetailsDTO(
                agent.getMatricule(),
                agent.getNom(),
                agent.getPrenom(),
                agent.getFonction(),
                congeDetails
        );

        return Optional.of(result);
    }

    private String extractAnneeFromReference(String reference) {
        if (reference == null || reference.isEmpty()) {
            return "";
        }

        String[] parts = reference.split("/");
        if (parts.length >= 3) {
            return parts[2];
        }

        return "";
    }
}