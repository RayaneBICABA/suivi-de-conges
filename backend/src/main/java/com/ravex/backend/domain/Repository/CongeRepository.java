package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CongeRepository extends JpaRepository<Conge, String> {
    
    //Savoir si une référence de congé existe
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.centre.codeCentre = :centre")
    boolean existsByReference(@Param("reference") String reference, @Param("centre") int centre);

    // Trouver un congé par sa référence
    Optional<Conge> findByReference(String reference);

    // Récupérer le nombre de jours total attribué a un agent vi reference de conge
    @Query("SELECT c.jours FROM Conge c JOIN c.agent a WHERE c.reference = :reference AND a.centre.codeCentre = :centre")
    Integer collecterJoursAttribuerAunAgentParReferenceDeConge(@Param("reference") String reference, @Param("centre") int centre);


    // Fixed query for counting congés en cours
    /*
    Conge c → Vous partez de l'entité Conge
JOIN c.agent a → Vous joingnez l'Agent via la relation @ManyToOne
a.centre.codeCentre → Vous accédez au Centre via la relation @ManyToOne dans Agent
     */
    @Query("""
        SELECT COUNT(DISTINCT c.reference)
        FROM Conge c
        JOIN c.agent a
        WHERE c.jours > COALESCE(
            (SELECT SUM(s.jours)
             FROM c.suiviConge s), 0
        )
         AND a.centre.codeCentre = :centre
    """)
    long countCongesEnCours(@Param("centre") int centre);

    // Conges termines
    @Query("""
    SELECT COUNT(DISTINCT c.reference)
    FROM Conge c
    JOIN c.agent a
    WHERE c.jours <= COALESCE(
        (SELECT SUM(s.jours)
         FROM c.suiviConge s), 0
    )
    AND a.centre.codeCentre = :centre
""")
    long countCongesTermines(@Param("centre") int centre);
}
