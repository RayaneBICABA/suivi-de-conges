package com.ravex.backend.Controller;

import com.ravex.backend.domain.Repository.AgentRepository;
import com.ravex.backend.domain.model.Agent;
import com.ravex.backend.domain.model.Conge;
import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.dto.NouveauCongeDTO;
import com.ravex.backend.service.CongeService;
import com.ravex.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/conge")
@RequiredArgsConstructor
public class CongeController {

    private final CongeService congeService;
    private final AgentRepository agentRepository;

    // Vérifier si la référence existe
    @GetMapping("/checkRef")
    public ResponseEntity<String> checkerSiRefExite(
            @RequestParam int refNumber,
            @RequestParam int year,
            @RequestHeader("Authorization") String authHeader
    ) {
        // Récupération de la direction depuis le JWT
        String token = JwtUtil.extractTokenFromHeader(authHeader);
        DirectionDto direction = JwtUtil.getDirectionFromToken(token);

        String reference = refNumber + "/DRH/" + year;

        if (congeService.voirSiRefCongeExiste(reference, direction.numero())) {
            return ResponseEntity.ok("La référence existe : " + reference);
        } else {
            return ResponseEntity.status(404).body("La référence n’existe pas : " + reference);
        }
    }

    // Ajouter un congé
    @PostMapping
    public ResponseEntity<?> ajouterConge(
            @RequestBody NouveauCongeDTO dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        // Récupérer la direction depuis le JWT
        String token = JwtUtil.extractTokenFromHeader(authHeader);
        DirectionDto direction = JwtUtil.getDirectionFromToken(token);

        // Vérifier que l'agent existe
        Optional<Agent> agentOpt = agentRepository.findByMatriculeTrimmed(dto.getMatriculeAgent(), direction.numero());
        if (agentOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("Agent introuvable avec matricule : " + dto.getMatriculeAgent());
        }

        // Créer et sauvegarder le congé
        Conge conge = Conge.builder()
                .reference(dto.getReference())
                .jours(dto.getJours())
                .agent(agentOpt.get())
                .build();

        Conge saved = congeService.enregistrerConge(conge, direction.numero());
        return ResponseEntity.ok(saved);
    }
}
