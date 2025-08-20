package com.ravex.backend.domain.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ravex.backend.domain.model.Conge;

public interface CongeRepository extends JpaRepository<Conge, String> {
    boolean existsByReference(String reference);





     // Méthode pour obtenir le nombre de jours de congé d'un agent spécifique
    // @Query("SELECT c.jours FROM Conge c WHERE c.agent.matricule = :matriculeParametrer")
    // Integer trouverJoursDeCongeAgenViaMatricule(@Param("matriculeParametrer") String matricule);

    // Méthode pour obtenir les references conges
    //@Query("SELECT c.reference FROM Conge c WHERE c.return = :reference")
    //String obtenirUneReferenceCongeViaReference(@Param("reference") String reference);

}
