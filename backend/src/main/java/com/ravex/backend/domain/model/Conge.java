package com.ravex.backend.domain.model;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "CONGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"agent", "suiviConges"})
@ToString(exclude = {"agent", "suiviConges"})
public class Conge {
    
    @Id
    @Column(name = "CO_REF", length = 15, nullable = false)
    private String reference;
    
    @Column(name = "CO_JOUR", nullable = false)
    private Integer jours;
    
    @Column(name = "CO_DATE")
    private LocalDate dateDemande;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "A_MATRICULE", nullable = false)
    @JsonBackReference
    private Agent agent;
    
    @OneToMany(mappedBy = "conge", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SuiviConge> suiviConges;
    
    // Méthodes utilitaires
    /**
     * Calcule le nombre de jours déjà utilisés pour ce congé
     */
    public Integer getJoursUtilises() {
        if (suiviConges == null || suiviConges.isEmpty()) {
            return 0;
        }
        return suiviConges.stream()
                .mapToInt(suivi -> suivi.getJours() != null ? suivi.getJours() : 0)
                .sum();
    }
    
    /**
     * Calcule le nombre de jours restants pour ce congé
     */
    public Integer getJoursRestants() {
        return (jours != null ? jours : 0) - getJoursUtilises();
    }
    
    /**
     * Vérifie si le congé est complètement utilisé
     */
    public Boolean isCompletementUtilise() {
        return getJoursRestants() <= 0;
    }
}