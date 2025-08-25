package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CongeRepository extends JpaRepository<Conge, String> {
    
    //Savoir si une référence de congé existe
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Conge c WHERE c.reference = :reference")
    boolean existsByReference(@Param("reference") String reference);

    // Trouver un congé par sa référence
    Optional<Conge> findByReference(String reference);

    // Récupérer le nombre de jours total attribué a un agent vi reference de conge
    @Query("SELECT c.jours FROM Conge c WHERE c.reference = :reference")
    Integer collecterJoursAttribuerAunAgentParReferenceDeConge(@Param("reference") String reference);



}
