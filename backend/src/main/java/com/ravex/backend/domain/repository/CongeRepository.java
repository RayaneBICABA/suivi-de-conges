package com.ravex.backend.domain.repository;

import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.domain.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CongeRepository extends JpaRepository<Conge, String> {

    /**
     * Trouve tous les congés d'un agent
     */
    List<Conge> findByAgentMatricule(String matricule);

    /**
     * Trouve tous les congés d'un agent avec les suivis
     */
    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.suiviConges WHERE c.agent.matricule = :matricule")
    List<Conge> findByAgentMatriculeWithSuivi(@Param("matricule") String matricule);

    /**
     * Trouve les congés par année de demande
     */
    @Query("SELECT c FROM Conge c WHERE YEAR(c.dateDemande) = :annee")
    List<Conge> findByAnneeDesignation(@Param("annee") int annee);

    /**
     * Trouve les congés dans une période donnée
     */
    @Query("SELECT c FROM Conge c WHERE c.dateDemande BETWEEN :dateDebut AND :dateFin")
    List<Conge> findByPeriodeDemande(@Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);

    /**
     * Trouve un congé avec son agent et ses suivis
     */
    @Query("SELECT c FROM Conge c " +
            "LEFT JOIN FETCH c.agent " +
            "LEFT JOIN FETCH c.suiviConges " +
            "WHERE c.reference = :reference")
    Optional<Conge> findByReferenceWithDetails(@Param("reference") String reference);

    /**
     * Trouve les congés ayant encore des jours disponibles
     */
    @Query("SELECT c FROM Conge c WHERE c.jours > " +
            "(SELECT COALESCE(SUM(s.jours), 0) FROM SuiviConge s WHERE s.conge.reference = c.reference)")
    List<Conge> findCongesAvecJoursRestants();

    /**
     * Calcule le total des jours de congé pour un agent
     */
    @Query("SELECT COALESCE(SUM(c.jours), 0) FROM Conge c WHERE c.agent.matricule = :matricule")
    Integer getTotalJoursCongeByAgent(@Param("matricule") String matricule);

    /**
     * Trouve les congés par référence partielle
     */
    List<Conge> findByReferenceContainingIgnoreCase(String referencePartielle);

    /**
     * Vérifie si une référence existe
     */
    boolean existsByReference(String reference);

    /**
     * Trouve les congés récents (derniers 30 jours)
     */
    @Query("SELECT c FROM Conge c WHERE c.dateDemande >= :date ORDER BY c.dateDemande DESC")
    List<Conge> findRecentConges(@Param("date") LocalDate dateDebut);

    /**
     * Statistiques des congés par service
     */
    @Query("SELECT a.service, COUNT(c), SUM(c.jours) FROM Conge c " +
            "JOIN c.agent a GROUP BY a.service ORDER BY a.service")
    List<Object[]> getStatistiquesCongesParService();

    /**
     * Trouve les congés expirés (plus anciens qu'un an sans suivi)
     */
    @Query("SELECT c FROM Conge c WHERE c.dateDemande < :dateLimit " +
            "AND NOT EXISTS (SELECT 1 FROM SuiviConge s WHERE s.conge.reference = c.reference)")
    List<Conge> findCongesExpires(@Param("dateLimit") LocalDate dateLimit);
}