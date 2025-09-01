package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// Méthodes natives sur l'entité Agent: save(Agent agent) | findById(String id) | findAll() | delete(Agent agent) | deleteById(String id)| count() | existsById(String id)

public interface AgentRepository extends JpaRepository<Agent, String> {
    // Récupérer Nom et prénom d'un agent
    @Query("SELECT new com.ravex.backend.dto.AgentNomPrenomDTO(a.nom, a.prenom) " +
            "FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule))")
    Optional<AgentNomPrenomDTO> obtenirNomEtPrenomAgentViaMatricule(@Param("matricule") String matricule);

    @Query("SELECT a FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule))")
    Optional<Agent> findByMatriculeTrimmed(@Param("matricule") String matricule);

    // Agent (Matricule, Fullname, Fonction)
    @Query("""
    SELECT new com.ravex.backend.dto.dashboard.AgentSummaryDTO(
        a.matricule,
        CONCAT(a.prenom,' ',a.nom),
        a.fonction
    )
    FROM Agent a
    """)
    List<AgentSummaryDTO> agentSummary();

    // Rechercher Agent Par nom ou prenom et renvoyer AgentSummaryDTO
    @Query("""
    SELECT new com.ravex.backend.dto.dashboard.AgentSummaryDTO(
        a.matricule,
        CONCAT(a.prenom, ' ', a.nom),
        a.fonction
    )
        FROM Agent a
        WHERE UPPER(a.nom) LIKE CONCAT('%', UPPER(:keyword), '%')
           OR UPPER(a.prenom) LIKE CONCAT('%', UPPER(:keyword), '%')
    """)
    List<AgentSummaryDTO> searchAgentByNomOrPrenom(@Param("keyword") String keyword);


}
