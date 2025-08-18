package com.ravex.backend.domain.repository;

import com.ravex.backend.domain.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, String> {

    /**
     * Recherche par nom (insensible à la casse)
     */
    List<Agent> findByNomContainingIgnoreCase(String nom);

    /**
     * Recherche par prénom (insensible à la casse)
     */
    List<Agent> findByPrenomContainingIgnoreCase(String prenom);

    /**
     * Recherche par nom ET prénom
     */
    @Query("SELECT a FROM Agent a WHERE " +
            "UPPER(a.nom) LIKE UPPER(CONCAT('%', :nom, '%')) AND " +
            "UPPER(a.prenom) LIKE UPPER(CONCAT('%', :prenom, '%'))")
    List<Agent> findByNomAndPrenomContaining(@Param("nom") String nom, @Param("prenom") String prenom);

    /**
     * Recherche par service
     */
    List<Agent> findByServiceIgnoreCase(String service);

    /**
     * Recherche par unité
     */
    List<Agent> findByUniteIgnoreCase(String unite);

    /**
     * Recherche par fonction
     */
    List<Agent> findByFonctionContainingIgnoreCase(String fonction);

    /**
     * Recherche globale (nom, prénom ou matricule)
     */
    @Query("SELECT a FROM Agent a WHERE " +
            "UPPER(a.matricule) LIKE UPPER(CONCAT('%', :search, '%')) OR " +
            "UPPER(a.nom) LIKE UPPER(CONCAT('%', :search, '%')) OR " +
            "UPPER(a.prenom) LIKE UPPER(CONCAT('%', :search, '%'))")
    List<Agent> searchAgents(@Param("search") String searchTerm);

    /**
     * Trouve un agent avec ses congés
     */
    @Query("SELECT a FROM Agent a LEFT JOIN FETCH a.conges WHERE a.matricule = :matricule")
    Optional<Agent> findByMatriculeWithConges(@Param("matricule") String matricule);

    /**
     * Trouve les agents ayant des congés actifs
     */
    @Query("SELECT DISTINCT a FROM Agent a JOIN a.conges c WHERE c.jours > 0")
    List<Agent> findAgentsWithActiveConges();

    /**
     * Compte le nombre d'agents par service
     */
    @Query("SELECT a.service, COUNT(a) FROM Agent a GROUP BY a.service ORDER BY a.service")
    List<Object[]> countAgentsByService();

    /**
     * Vérifie si un agent existe
     */
    boolean existsByMatricule(String matricule);
}