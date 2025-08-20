package com.ravex.backend.Controller;

import com.ravex.backend.service.CongeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/conge")
public class CongeController {
    private final CongeService congeService;

    public CongeController(CongeService congeService) {
        this.congeService = congeService;
    }

    // Modifier la méthode pour accepter le numéro de référence et l'année en tant que paramètres
    // Exemple d'URL : http://localhost:8080/conge/checkRef?refNumber=2006&year=2024
    @GetMapping("/checkRef")
    public ResponseEntity<String> checkerSiRefExite(@RequestParam int refNumber, @RequestParam int year){
        // Construire la référence : int/DRH/année
        String reference = refNumber + "/DRH/" + year;

        if(congeService.voirSiRefCongeExiste(reference)){
            return ResponseEntity.ok("La référence existe : " + reference);
        } else {
            return ResponseEntity.status(404).body("La référence n’existe pas : " + reference);
        }
    }
}