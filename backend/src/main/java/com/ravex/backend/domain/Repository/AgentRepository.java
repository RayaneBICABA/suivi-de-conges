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

    // ✅ CORRECTION : Filtrage par centres de la direction
    @Query("SELECT new com.ravex.backend.dto.AgentNomPrenomDTO(a.nom, a.prenom) " +
            "FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule)) AND a.centre.direction.numero = :direction")
    Optional<AgentNomPrenomDTO> obtenirNomEtPrenomAgentViaMatricule(@Param("matricule") String matricule, @Param("direction") Long direction);

    // ✅ CORRECTION : Filtrage par centres de la direction
    @Query("SELECT a FROM Agent a WHERE UPPER(TRIM(a.matricule)) = UPPER(TRIM(:matricule)) AND a.centre.direction.numero = :direction")
    Optional<Agent> findByMatriculeTrimmed(@Param("matricule") String matricule, @Param("direction") Long direction);

    // ✅ CORRECTION : Agent (Matricule, Fullname, Fonction) par centres de la direction
    @Query("""
    SELECT new com.ravex.backend.dto.dashboard.AgentSummaryDTO(
        a.matricule,
        CONCAT(a.prenom,' ',a.nom),
        a.fonction
    )
    FROM Agent a
    WHERE a.centre.direction.numero = :direction
    """)
    List<AgentSummaryDTO> agentSummaryByDirection(@Param("direction") Long direction);

    // ✅ CORRECTION : Rechercher Agent par centres de la direction
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
       AND a.centre.direction.numero = :direction
""")
    List<AgentSummaryDTO> searchAgentByNomOrPrenom(@Param("keyword") String keyword, @Param("direction") Long direction);

    // ✅ CORRECTION : Nombre total des agents par centres de la direction
    @Query("SELECT COUNT(a) FROM Agent a WHERE a.centre.direction.numero = :direction")
    long countByDirection(@Param("direction") Long direction);
}