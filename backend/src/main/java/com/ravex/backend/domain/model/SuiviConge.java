package com.ravex.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "SUIVI_CONGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"conge", "agent"})
@ToString(exclude = {"conge", "agent"})
public class SuiviConge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "suivi_conge_seq")
    @SequenceGenerator(name = "suivi_conge_seq", sequenceName = "SUIVI_CONGE_SEQ", allocationSize = 1)
    @Column(name = "SC_NUM", nullable = false)
    private Long id;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CO_REF", nullable = false)
    @JsonBackReference
    private Conge conge;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "A_MATRICULE")
    @JsonBackReference
    private Agent agent;
    
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
    
    // Méthodes utilitaires
    /**
     * Calcule automatiquement le nombre de jours entre dateDebut et dateFin
     */
    public Integer calculerNombreJours() {
        if (dateDebut != null && dateFin != null) {
            return (int) ChronoUnit.DAYS.between(dateDebut, dateFin) + 1; // +1 pour inclure le dernier jour
        }
        return 0;
    }
    
    /**
     * Valide que la date de fin est après la date de début
     */
    public Boolean isPeriodesValides() {
        return dateDebut != null && dateFin != null && !dateFin.isBefore(dateDebut);
    }
    
    /**
     * Met à jour automatiquement le nombre de jours basé sur les dates
     */
    @PrePersist
    @PreUpdate
    public void updateJours() {
        if (jours == null) {
            jours = calculerNombreJours();
        }
        if (totalJours == null) {
            totalJours = (jours != null ? jours : 0) + (joursRattrapage != null ? joursRattrapage : 0);
        }
    }
}