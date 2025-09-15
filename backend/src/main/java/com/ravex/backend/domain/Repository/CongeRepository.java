package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CongeRepository extends JpaRepository<Conge, String> {

    // ✅ CORRECTION : Filtrage par centres de la direction
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.centre.direction.numero = :direction")
    boolean existsByReference(@Param("reference") String reference, @Param("direction") Long direction);

    // ✅ CORRECTION : Trouver un congé par référence ET direction (via centres)
    @Query("SELECT c FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.centre.direction.numero = :direction")
    Optional<Conge> findByReferenceAndDirection(@Param("reference") String reference, @Param("direction") Long direction);

    // ⚠️ MÉTHODE DÉPRÉCIÉE : À utiliser seulement si nécessaire (sans filtrage direction)
    Optional<Conge> findByReference(String reference);

    // ✅ CORRECTION : Filtrage par centres de la direction
    @Query("SELECT c.jours FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.centre.direction.numero = :direction")
    Integer collecterJoursAttribuerAunAgentParReferenceDeConge(@Param("reference") String reference, @Param("direction") Long direction);

    // ✅ CORRECTION : Congés en cours par centres de la direction
    @Query("""
        SELECT COUNT(DISTINCT c.reference)
        FROM Conge c
        JOIN c.agent a
        WHERE c.jours > COALESCE(
            (SELECT SUM(s.jours)
             FROM c.suiviConge s), 0
        )
         AND a.centre.direction.numero = :direction
    """)
    long countCongesEnCours(@Param("direction") Long direction);

    // ✅ CORRECTION : Congés terminés par centres de la direction
    @Query("""
    SELECT COUNT(DISTINCT c.reference)
    FROM Conge c
    JOIN c.agent a
    WHERE c.jours <= COALESCE(
        (SELECT SUM(s.jours)
         FROM c.suiviConge s), 0
    )
    AND a.centre.direction.numero = :direction
""")
    long countCongesTermines(@Param("direction") Long direction);
}