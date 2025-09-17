package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Conge;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CongeService {
    private final CongeRepository congeRepository;

    public boolean voirSiRefCongeExiste(String reference, Long directionNumero) {
        return congeRepository.existsByReference(reference, directionNumero);
    }

    public Conge enregistrerConge(Conge conge, Long directionNumero) {
        if (conge.getReference() == null || voirSiRefCongeExiste(conge.getReference(), directionNumero)) {
            throw new IllegalArgumentException("La référence de congé est nulle ou existe déjà : " + conge.getReference());
        }
        return congeRepository.save(conge);
    }

    public Conge getCongeByReferenceAndDirection(String reference, Long directionNumero) {
        return congeRepository.findByReferenceAndDirection(reference, directionNumero)
                .orElseThrow(() -> new IllegalArgumentException("Congé introuvable : " + reference));
    }
}