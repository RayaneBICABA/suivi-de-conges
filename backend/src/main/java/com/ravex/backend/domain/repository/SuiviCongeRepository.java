package com.ravex.backend.domain.repository;

import com.ravex.backend.domain.model.SuiviConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SuiviCongeRepository extends JpaRepository<SuiviConge, Long> {
    
    /**
     * Trouve tous les suivis d'un agent
     */
    @Query("SELECT s FROM SuiviConge s WHERE s.agent.matricule = :matricule ORDER BY s.dateDebut DESC")
    List<SuiviConge> findByAgentMatricule(@Param("matricule") String matricule);
    
    /**
     * Trouve tous les suivis d'un congé
     */
    @Query("SELECT s FROM SuiviConge s WHERE s.conge.reference = :reference ORDER BY s.dateDebut DESC")
    List<SuiviConge> findByCongeReference(@Param("reference") String reference);
    
    /**
     * Trouve un suivi avec ses relations
     */
    @Query("SELECT s FROM SuiviConge s " +
           "LEFT JOIN FETCH s.agent " +
           "LEFT JOIN FETCH s.conge " +
           "WHERE s.id = :id")
    Optional<SuiviConge> findByIdWithDetails(@Param("id") Long id);
    
    /**
     * Trouve les suivis dans une période donnée
     */
    @Query("SELECT s FROM SuiviConge s WHERE " +
           "(s.dateDebut BETWEEN :dateDebut AND :dateFin) OR " +
           "(s.dateFin BETWEEN :dateDebut AND :dateFin) OR " +
           "(s.dateDebut <= :dateDebut AND s.dateFin >= :dateFin)")
    List<SuiviConge> findByPeriode(@Param("dateDebut") LocalDate dateDebut, 
                                   @Param("dateFin") LocalDate dateFin);
    
    /**
     * Trouve les suivis actifs (en cours)
     */
    @Query("SELECT s FROM SuiviConge s WHERE :today BETWEEN s.dateDebut AND s.dateFin")
    List<SuiviConge> findSuivisActifs(@Param("today") LocalDate today);
    
    /**
     * Trouve les suivis futurs
     */
    @Query("SELECT s FROM SuiviConge s WHERE s.dateDebut > :today ORDER BY s.dateDebut ASC")
    List<SuiviConge> findSuivisFuturs(@Param("today") LocalDate today);
    
    /**
     * Trouve les suivis passés
     */
    @Query("SELECT s FROM SuiviConge s WHERE s.dateFin < :today ORDER BY s.dateFin DESC")
    List<SuiviConge> findSuivisPasses(@Param("today") LocalDate today);
    
    /**
     * Calcule le total des jours pris par un agent
     */
    @Query("SELECT COALESCE(SUM(s.jours), 0) FROM SuiviConge s WHERE s.agent.matricule = :matricule")
    Integer getTotalJoursPrisByAgent(@Param("matricule") String matricule);
    
    /**
     * Calcule le total des jours utilisés pour un congé
     */
    @Query("SELECT COALESCE(SUM(s.jours), 0) FROM SuiviConge s WHERE s.conge.reference = :reference")
    Integer getTotalJoursUtilisesByConge(@Param("reference") String reference);
    
    /**
     * Vérifie s'il y a conflit de dates pour un agent
     */
    @Query("SELECT COUNT(s) FROM SuiviConge s WHERE s.agent.matricule = :matricule AND " +
           "((s.dateDebut BETWEEN :dateDebut AND :dateFin) OR " +
           "(s.dateFin BETWEEN :dateDebut AND :dateFin) OR " +
           "(s.dateDebut <= :dateDebut AND s.dateFin >= :dateFin)) AND " +
           "(:id IS NULL OR s.id != :id)")
    Long countConflitDates(@Param("matricule") String matricule,
                          @Param("dateDebut") LocalDate dateDebut,
                          @Param("dateFin") LocalDate dateFin,
                          @Param("id") Long id);
    
    /**
     * Trouve les suivis par année
     */
    @Query("SELECT s FROM SuiviConge s WHERE YEAR(s.dateDebut) = :annee ORDER BY s.dateDebut DESC")
    List<SuiviConge> findByAnnee(@Param("annee") int annee);
    
    /**
     * Statistiques par mois
     */
    @Query("SELECT YEAR(s.dateDebut), MONTH(s.dateDebut), COUNT(s), SUM(s.jours) " +
           "FROM SuiviConge s GROUP BY YEAR(s.dateDebut), MONTH(s.dateDebut) " +
           "ORDER BY YEAR(s.dateDebut) DESC, MONTH(s.dateDebut) DESC")
    List<Object[]> getStatistiquesParMois();
    
    /**
     * Top 10 des agents avec le plus de jours de congé pris
     */
    @Query("SELECT s.agent.matricule, s.agent.nom, s.agent.prenom, SUM(s.jours) " +
           "FROM SuiviConge s GROUP BY s.agent.matricule, s.agent.nom, s.agent.prenom " +
           "ORDER BY SUM(s.jours) DESC")
    List<Object[]> getTopAgentsConges(@Param("limit") int limit);
    
    /**
     * Trouve les derniers suivis créés
     */
    @Query("SELECT s FROM SuiviConge s ORDER BY s.id DESC")
    List<SuiviConge> findRecentSuivis();
}