package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CongeRepository extends JpaRepository<Conge, String> {
    
    //boolean existsByReference(String reference);

    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Conge c WHERE c.reference = :reference")
    boolean existsByReference(@Param("reference") String reference);

    Optional<Conge> findByReference(String reference); 
}
