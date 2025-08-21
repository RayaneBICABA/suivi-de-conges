package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

// Méthodes natives sur l'entité Agent: save(Agent agent) | findById(String id) | findAll() | delete(Agent agent) | deleteById(String id)| count() | existsById(String id)

public interface AgentRepository extends JpaRepository<Agent, String> {

    // Récupérer Nom et prénom d'un agent
//    @Query("SELECT new com.ravex.backend.dto.AgentNomPrenomDTO(a.nom, a.prenom) " +
//            "FROM Agent a WHERE a.matricule = :matricule")
//    Optional<AgentNomPrenomDTO> obtenirNomEtPrenomAgentViaMatricule(@Param("matricule") String matricule);

    @Query("SELECT new com.ravex.backend.dto.AgentNomPrenomDTO(a.nom, a.prenom) " +
            "FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule))")
    Optional<AgentNomPrenomDTO> obtenirNomEtPrenomAgentViaMatricule(@Param("matricule") String matricule);
}
