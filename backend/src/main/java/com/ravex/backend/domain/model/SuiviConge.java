package com.ravex.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "SUIVI_CONGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiviConge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "suivi_conge_seq")
    @SequenceGenerator(name = "suivi_conge_seq", sequenceName = "SUIVI_CONGE_SEQ", allocationSize = 1)
    @Column(name = "SC_NUM", nullable = false)
    private Long id;
    
    @Column(name = "SC_PERIODE1", nullable = false)
    private LocalDate dateDebut;
    
    @Column(name = "SC_PERIODE2", nullable = false)
    private LocalDate dateFin;
    
    @Column(name = "SC_JOUR")
    private Integer jours;
    
    @Column(name = "SC_RAV")
    private Integer joursRattrapage;
    
    @Column(name = "TOT_SC_JOUR")
    private Integer totalJours;
    
    @Column(name = "JOUR")
    private Integer jour;
    
}