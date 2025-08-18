package com.ravex.backend.domain.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "AGENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "conges") // Évite les boucles infinies
@ToString(exclude = "conges") // Évite les boucles infinies
public class Agent {
    
    @Id
    @Column(name = "A_MATRICULE", nullable = false, length = 6)
    private String matricule;
    
    @Column(name = "A_NOM", length = 75)
    private String nom;
    
    @Column(name = "A_PRENOM", length = 30)
    private String prenom;
    
    @Column(name = "A_UNITE", length = 30)
    private String unite;
    
    @Column(name = "A_SERVICE", length = 30)
    private String service;
    
    @Column(name = "CENTRE")
    private Integer centre;
    
    @Column(name = "A_FONCTION", length = 50)
    private String fonction;
    
    @Column(name = "A_COUT", length = 10)
    private String cout;
    
    @Column(name = "CA_CLASSE", length = 3)
    private String classe;
    
    // Relations
    @OneToMany(mappedBy = "agent", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Conge> conges;
    
    @OneToMany(mappedBy = "agent", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<SuiviConge> suiviConges;
    
    // Méthodes utilitaires
    public String getFullName() {
        return (nom != null ? nom : "") + " " + (prenom != null ? prenom : "");
    }
    
    /**
     * Calcule le total des jours de congé accordés à cet agent
     */
    public Integer getTotalJoursConge() {
        if (conges == null || conges.isEmpty()) {
            return 0;
        }
        return conges.stream()
                .mapToInt(conge -> conge.getJours() != null ? conge.getJours() : 0)
                .sum();
    }
    
    /**
     * Calcule le total des jours de congé déjà pris
     */
    public Integer getTotalJoursPris() {
        if (suiviConges == null || suiviConges.isEmpty()) {
            return 0;
        }
        return suiviConges.stream()
                .mapToInt(suivi -> suivi.getJours() != null ? suivi.getJours() : 0)
                .sum();
    }
    
    /**
     * Calcule les jours de congé restants
     */
    public Integer getJoursRestants() {
        return getTotalJoursConge() - getTotalJoursPris();
    }
}