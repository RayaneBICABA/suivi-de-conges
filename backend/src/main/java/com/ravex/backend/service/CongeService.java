package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import org.springframework.stereotype.Service;

@Service
public class CongeService {
    private final CongeRepository congeRepository;

    public CongeService(CongeRepository congeRepository) {
        this.congeRepository = congeRepository;
    }

    // Recuperer le nombre de jours de conges par matricule de l'agent
    // public Optional<Integer> getJoursCongeParMatricule(String matricule){
    //     Integer totalJourPourAgent = congeRepository.trouverJoursDeCongeAgenViaMatricule(matricule);
    //     return Optional.ofNullable(totalJourPourAgent);
    // }

    // Checker si Reference Conge existe
    public boolean voirSiRefCongeExiste(String reference){
        return congeRepository.existsByReference(reference);
    }
}
