package com.ravex.backend.Controller;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.Repository.CongeRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.NouveauCongeDTO;
import com.ravex.backend.service.CongeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/conge")
public class CongeController {

    private final CongeService congeService;
    private final AgentRepository agentRepository;
    private final CongeRepository congeRepository;

    public CongeController(CongeService congeService, AgentRepository agentRepository, CongeRepository congeRepository) {
        this.congeService = congeService;
        this.agentRepository = agentRepository;
        this.congeRepository = congeRepository;
    }

    // Vérifier si la référence existe
    @GetMapping("/checkRef")
    public ResponseEntity<String> checkerSiRefExite(@RequestParam int refNumber, @RequestParam int year) {
        String reference = refNumber + "/DRH/" + year;

        if (congeService.voirSiRefCongeExiste(reference)) {
            return ResponseEntity.ok("La référence existe : " + reference);
        } else {
            return ResponseEntity.status(404).body("La référence n’existe pas : " + reference);
        }
    }

    // Ajouter un congé
    @PostMapping
    public ResponseEntity<?> ajouterConge(@RequestBody NouveauCongeDTO dto) {
        // Vérifier que l'agent existe
        Optional<Agent> agentOpt = agentRepository.findByMatriculeTrimmed(dto.getMatriculeAgent());
        if (agentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Agent introuvable avec matricule : " + dto.getMatriculeAgent());
        }

        // Vérifier si la référence existe déjà
//        if (congeRepository.existsByReference(dto.getReference())) {
//            return ResponseEntity.status(400).body("Un congé avec la référence " + dto.getReference() + " existe déjà");
//}

        // Créer et sauvegarder le congé
        Conge conge = Conge.builder()
                .reference(dto.getReference())
                .jours(dto.getJours())
                .agent(agentOpt.get())
                .build();

        Conge saved = congeService.enregistrerConge(conge);
        return ResponseEntity.ok(saved);
    }
}
