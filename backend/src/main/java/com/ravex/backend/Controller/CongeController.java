package com.ravex.backend.Controller;

import com.ravex.backend.service.CongeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;

@RestController
@RequestMapping("/conge")
public class CongeController {
    private final CongeService congeService;

    public CongeController(CongeService congeService) {
        this.congeService = congeService;
    }

    // Vérifier si une référence existe
    // http://localhost:8080/conge/checkRef?refNumber=2006
    @GetMapping("/checkRef")
    public ResponseEntity<String> checkerSiRefExite(@RequestParam int refNumber){
        // Construire la référence : int/DRH/année
        String currentYear = String.valueOf(Year.now().getValue());
        String reference = refNumber + "/DRH/" + currentYear;

        if(congeService.voirSiRefCongeExiste(reference)){
            return ResponseEntity.ok("La référence existe : " + reference);
        } else {
            return ResponseEntity.status(404).body("La référence n’existe pas : " + reference);
        }
    }

    // @GetMapping("/checkRef")
    // public ResponseEntity<String> checkerSiRefExite(@RequestParam int refNumber){
    //     // Construire la référence : int/DRH/année
    //     String currentYear = "2017";
    //     String reference = refNumber + "/DRH/" + currentYear;

    //     if(congeService.voirSiRefCongeExiste(reference)){
    //         return ResponseEntity.ok("La référence existe : " + reference);
    //     } else {
    //         return ResponseEntity.status(404).body("La référence n’existe pas : " + reference);
    //     }
    // }
}
