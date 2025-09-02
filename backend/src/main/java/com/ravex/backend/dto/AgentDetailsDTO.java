package com.ravex.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgentDetailsDTO {
    private String matricule;
    private String nom;
    private String prenom;
    private String fonction;
    private List<CongeDetailDTO> conges;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CongeDetailDTO {
        private String reference;
        private Integer joursAttribues;
        private Integer joursRestants;
        private String annee; // Extraite de la référence
        private List<SuiviDetailDTO> suivis;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SuiviDetailDTO {
        private LocalDate dateDebut;
        private LocalDate dateFin;
        private Integer jours;
    }
}