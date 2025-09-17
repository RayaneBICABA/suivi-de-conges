package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CongeRepository extends JpaRepository<Conge, String> {

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.direction.numero = :direction")
    boolean existsByReference(@Param("reference") String reference, @Param("direction") Long direction);

    @Query("SELECT c FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.direction.numero = :direction")
    Optional<Conge> findByReferenceAndDirection(@Param("reference") String reference, @Param("direction") Long direction);

    Optional<Conge> findByReference(String reference);

    @Query("SELECT c.jours FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.direction.numero = :direction")
    Integer collecterJoursAttribuerAunAgentParReferenceDeConge(@Param("reference") String reference, @Param("direction") Long direction);

    @Query("""
        SELECT COUNT(DISTINCT c.reference)
        FROM Conge c
        JOIN c.agent a
        WHERE c.jours > COALESCE(
            (SELECT SUM(s.jours)
             FROM c.suiviConge s), 0
        )
         AND a.direction.numero = :direction
    """)
    long countCongesEnCours(@Param("direction") Long direction);

    @Query("""
    SELECT COUNT(DISTINCT c.reference)
    FROM Conge c
    JOIN c.agent a
    WHERE c.jours <= COALESCE(
        (SELECT SUM(s.jours)
         FROM c.suiviConge s), 0
    )
    AND a.direction.numero = :direction
""")
    long countCongesTermines(@Param("direction") Long direction);
}