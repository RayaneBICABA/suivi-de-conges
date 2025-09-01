package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository <Utilisateur,Long> {
    boolean existsByEmail(String email);
    

    Optional<Utilisateur> findByEmail(String email);

}
