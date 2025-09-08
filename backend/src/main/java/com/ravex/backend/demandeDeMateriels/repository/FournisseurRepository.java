package com.ravex.backend.demandeDeMateriels.repository;

import com.ravex.backend.demandeDeMateriels.model.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FournisseurRepository extends JpaRepository<Fournisseur, String> {

    // Méthode corrigée pour vérifier l'existence du code fournisseur
    // Utilise COUNT au lieu de EXISTS pour éviter le problème FETCH FIRST
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN false ELSE true END FROM Fournisseur f WHERE f.code = :code")
    boolean checkerCodeFournisseur(@Param("code") String code);

    // Alternative avec EXISTS natif Oracle (si vous préférez)
    // @Query(value = "SELECT CASE WHEN EXISTS (SELECT 1 FROM FOURNIS WHERE FR_CODE = :code) THEN 0 ELSE 1 END FROM DUAL", nativeQuery = true)
    // boolean checkerCodeFournisseur(@Param("code") String code);
}