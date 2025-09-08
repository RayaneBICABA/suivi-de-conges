package com.ravex.backend.demandeDeMateriels.controller;

import com.ravex.backend.demandeDeMateriels.model.Fournisseur;
import com.ravex.backend.demandeDeMateriels.service.FournisseurService;
import com.ravex.backend.domain.model.Agent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fournisseur")
public class FournisseurController {
    private final FournisseurService fournisseurService;

    // Enregistrer un fournisseur
    @PostMapping
    public ResponseEntity<Fournisseur> enregistrerFournisseur(@RequestBody Fournisseur fournisseur){
        try{
            if (!fournisseurService.checkerCodeFournisseur(fournisseur.getCode())){
                throw new IllegalArgumentException("Code fournisseur déjà utilisé");
            }
            return ResponseEntity.ok(fournisseurService.enregistrerFournisseur(fournisseur));
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}
