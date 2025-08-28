package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilsateurRepository extends JpaRepository <Utilisateur,Long> {
}
