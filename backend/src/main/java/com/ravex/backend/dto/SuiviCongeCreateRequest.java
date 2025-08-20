package com.ravex.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SuiviCongeCreateRequest {
    private String matricule;
    private String congeRef;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer jours; // ignoré si incohérent
}
