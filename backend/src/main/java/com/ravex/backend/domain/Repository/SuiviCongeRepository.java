package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.SuiviConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SuiviCongeRepository extends JpaRepository<SuiviConge, Long> {
    // Obtenir la somme des jours de congés épuisés (Somme des SC_JOUR) pour un agent donné
    @Query("SELECT COALESCE(SUM(s.jours), 0) FROM SuiviConge s WHERE s.conge.reference = :reference")
    Integer totaljoursEpuise(@Param("reference") String reference);

}
