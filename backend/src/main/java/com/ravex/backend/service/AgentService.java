package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.Repository.SuiviCongeRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.AgentCongeDTO; // Importer le nouveau DTO
import com.ravex.backend.dto.AgentDetailsDTO;
import com.ravex.backend.dto.AgentNomPrenomDTO;
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

    public boolean checkerSiMatriculeExiste(String matricule) {
        return agentRepository.findByMatriculeTrimmed(matricule).isPresent();
    }

    // ===== Nouveau : Ajouter un agent =====
    public Agent addAgent(Agent agent) throws Exception {
        // Vérifier si le matricule existe déjà
        if (checkerSiMatriculeExiste(agent.getMatricule())) {
            throw new Exception("Le matricule " + agent.getMatricule() + " appartient déjà à un agent");
        }
        return agentRepository.save(agent);
    }


    @Transactional(readOnly = true)
    public Optional<AgentDetailsDTO> getAgentDetails(String matricule) {
        Optional<Agent> agentOpt = agentRepository.findByMatriculeTrimmed(matricule);

        if (agentOpt.isEmpty()) {
            return Optional.empty();
        }

        Agent agent = agentOpt.get();

        List<AgentDetailsDTO.CongeDetailDTO> congeDetails = new ArrayList<>();

        // Récupérer tous les congés de l'agent
        if (agent.getConges() != null && !agent.getConges().isEmpty()) {
            for (Conge conge : agent.getConges()) {
                // Extraire l'année de la référence (format: xxxx/DRH/yyyy)
                String annee = extractAnneeFromReference(conge.getReference());

                // Calculer les jours restants
                Integer joursConsommes = suiviCongeRepository.totaljoursEpuise(conge.getReference());
                Integer joursRestants = conge.getJours() - (joursConsommes != null ? joursConsommes : 0);

                // Récupérer les suivis pour ce congé
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

    // Méthode utilitaire pour extraire l'année de la référence
    private String extractAnneeFromReference(String reference) {
        if (reference == null || reference.isEmpty()) {
            return "";
        }

        // Format attendu: xxxx/DRH/yyyy
        String[] parts = reference.split("/");
        if (parts.length >= 3) {
            return parts[2]; // Retourne l'année
        }

        return ""; // Si le format n'est pas respecté
    }



}