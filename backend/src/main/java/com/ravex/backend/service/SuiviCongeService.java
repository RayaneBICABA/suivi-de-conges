package com.ravex.backend.service;

// package com.ravex.backend.service;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.Repository.SuiviCongeRepository;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.domain.model.SuiviConge;
import com.ravex.backend.dto.SuiviCongeCreateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.temporal.ChronoUnit;

@Service
public class SuiviCongeService {
    private final SuiviCongeRepository suiviCongeRepository;
    private final CongeRepository congeRepository;

    public SuiviCongeService(SuiviCongeRepository suiviCongeRepository, CongeRepository congeRepository) {
        this.suiviCongeRepository = suiviCongeRepository;
        this.congeRepository = congeRepository;
    }

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
}

