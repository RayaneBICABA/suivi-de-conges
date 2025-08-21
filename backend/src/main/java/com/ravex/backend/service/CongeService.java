package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Conge;
import org.springframework.stereotype.Service;

@Service
public class CongeService {
    private final CongeRepository congeRepository;

    public CongeService(CongeRepository congeRepository) {
        this.congeRepository = congeRepository;
    }

    // Vérifier si la référence de congé existe
    public boolean voirSiRefCongeExiste(String reference) {
        return congeRepository.existsByReference(reference);
    }

    // Enregistrer un nouveau congé
    public Conge enregistrerConge(Conge conge) {
        // Optionnel : vérifier si la référence existe déjà avant de sauvegarder
        if (conge.getReference() == null || voirSiRefCongeExiste(conge.getReference())) {
            throw new IllegalArgumentException("La référence de congé est nulle ou existe déjà : " + conge.getReference());
        }
        return congeRepository.save(conge);
    }
}
