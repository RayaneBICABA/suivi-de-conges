package com.ravex.backend.demandeDeMateriels.service;

import com.ravex.backend.demandeDeMateriels.model.Fournisseur;
import com.ravex.backend.demandeDeMateriels.repository.FournisseurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FournisseurService {
    private final FournisseurRepository fournisseurRepository;

    // Vérifier si code fournisseur est disponible (true = disponible, false = déjà utilisé)
    public boolean checkerCodeFournisseur(String code){
        return fournisseurRepository.checkerCodeFournisseur(code);
    }

    // Enregistrer un fournisseur
    public Fournisseur enregistrerFournisseur(Fournisseur fournisseur){
        return fournisseurRepository.save(fournisseur);
    }
}