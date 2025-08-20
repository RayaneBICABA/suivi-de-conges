package com.ravex.backend.Controller;

// package com.ravex.backend.Controller;
import com.ravex.backend.domain.model.SuiviConge;
import com.ravex.backend.dto.SuiviCongeCreateRequest;
import com.ravex.backend.service.SuiviCongeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/suivi-conge")
@CrossOrigin(origins = "http://localhost:5173")
public class SuiviCongeController {
    private final SuiviCongeService suiviCongeService;

    public SuiviCongeController(SuiviCongeService suiviCongeService) {
        this.suiviCongeService = suiviCongeService;
    }

    @PostMapping
    public ResponseEntity<?> createSuivi(@RequestBody SuiviCongeCreateRequest request) {
        try {
            SuiviConge saved = suiviCongeService.create(request);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", e.getMessage()
            ));
        }
    }

}


