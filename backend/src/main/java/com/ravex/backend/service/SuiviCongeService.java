package com.ravex.backend.service;

// package com.ravex.backend.service;
import com.ravex.backend.configuration.NumeroCentre;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.Repository.SuiviCongeRepository;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.domain.model.SuiviConge;
import com.ravex.backend.dto.SuiviCongeCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SuiviCongeService {
    private final SuiviCongeRepository suiviCongeRepository;
    private final CongeRepository congeRepository;
    private final NumeroCentre numeroCentre;


    public SuiviConge create(SuiviCongeCreateRequest req) {
        // 1) Récupérer le congé
        Conge conge = congeRepository.findById(req.getCongeRef())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Congé introuvable: " + req.getCongeRef()));

        // 2) Vérifier cohérence matricule
        String matriculeConge = conge.getAgent().getMatricule().trim();
        String matriculeReq = req.getMatricule().trim();
        if (!matriculeConge.equals(matriculeReq)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Matricule ne correspond pas à la référence de congé (" + matriculeConge + ")");
        }

        // 3) Vérifier période + recalcul jours
        if (req.getDateDebut() == null || req.getDateFin() == null || req.getDateFin().isBefore(req.getDateDebut())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Période invalide");
        }
        int joursCalcules = Math.toIntExact(ChronoUnit.DAYS.between(req.getDateDebut(), req.getDateFin())) + 1;

        // 4) Créer et sauvegarder le suivi
        SuiviConge sc = SuiviConge.builder()
                .dateDebut(req.getDateDebut())
                .dateFin(req.getDateFin())
                .jours(joursCalcules)
                .conge(conge)
                .agent(conge.getAgent()) // ← important pour respecter la contrainte NOT NULL
                .build();

        return suiviCongeRepository.save(sc);
    }



    // Calculer le nombre de jours restants pour un congé donné
    public int calculerJoursRestants(String referenceConge) {
        // 🔹 Vérifier que la référence existe
        Integer joursAttribues = congeRepository.collecterJoursAttribuerAunAgentParReferenceDeConge(referenceConge,numeroCentre.getNumCentre());
        if (joursAttribues == null) {
            throw new IllegalArgumentException("Référence de congé introuvable : " + referenceConge);
        }

        // 🔹 Total jours déjà consommés
        Integer joursEpuise = suiviCongeRepository.totaljoursEpuise(referenceConge);
        if (joursEpuise == null) joursEpuise = 0;

        int reste = joursAttribues - joursEpuise;
        return Math.max(reste, 0); // jamais négatif
    }
        
        
}

