package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.dto.AgentNomPrenomDTO;
import com.ravex.backend.dto.dashboard.AgentSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, String> {
    // Récupérer Nom et prénom d'un agent
    @Query("SELECT new com.ravex.backend.dto.AgentNomPrenomDTO(a.nom, a.prenom) " +
            "FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule)) AND a.centre.codeCentre = :centre")
    Optional<AgentNomPrenomDTO> obtenirNomEtPrenomAgentViaMatricule(@Param("matricule") String matricule, @Param("centre") int centre);

    @Query("SELECT a FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule)) AND a.centre.codeCentre = :centre")
    Optional<Agent> findByMatriculeTrimmed(@Param("matricule") String matricule, @Param("centre") int centre);

    // Agent (Matricule, Fullname, Fonction)
    @Query("""
    SELECT new com.ravex.backend.dto.dashboard.AgentSummaryDTO(
        a.matricule,
        CONCAT(a.prenom,' ',a.nom),
        a.fonction
    )
    FROM Agent a
    WHERE a.centre.codeCentre = :centre
    """)
    List<AgentSummaryDTO> agentSummary(@Param("centre") int centre);

    // Rechercher Agent Par nom ou prenom et renvoyer AgentSummaryDTO
    @Query("""
    SELECT new com.ravex.backend.dto.dashboard.AgentSummaryDTO(
        a.matricule,
        CONCAT(a.prenom, ' ', a.nom),
        a.fonction
    )
    FROM Agent a
    WHERE (UPPER(a.nom) LIKE CONCAT('%', UPPER(:keyword), '%')
       OR UPPER(a.prenom) LIKE CONCAT('%', UPPER(:keyword), '%')
       OR UPPER(CONCAT(a.prenom, ' ', a.nom)) LIKE CONCAT('%', UPPER(:keyword), '%')
       OR UPPER(a.matricule) LIKE CONCAT('%', UPPER(:keyword), '%'))
       AND a.centre.codeCentre = :centre
""")
    List<AgentSummaryDTO> searchAgentByNomOrPrenom(@Param("keyword") String keyword, @Param("centre") int centre);

    // Nombre total des agents
    @Query("SELECT COUNT(a) FROM Agent a WHERE a.centre.codeCentre = :centre")
    long countByCentre(@Param("centre") int centre);

}