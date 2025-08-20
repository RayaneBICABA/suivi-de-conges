package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import org.springframework.stereotype.Service;

@Service
public class CongeService {
    private final CongeRepository congeRepository;

    public CongeService(CongeRepository congeRepository) {
        this.congeRepository = congeRepository;
    }

    // Checker si Reference Conge existe
    public boolean voirSiRefCongeExiste(String reference){
        return congeRepository.existsByReference(reference);
    }
}
