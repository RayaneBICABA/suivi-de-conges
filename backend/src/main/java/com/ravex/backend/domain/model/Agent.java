    package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "AGENT")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Agent {
    @Id
    @Column(name = "A_MATRICULE", nullable = false, length = 20)
    private String matricule;

    @Column(name = "A_NOM", length = 75)
    private String nom;

    @Column(name = "A_PRENOM", length = 30)
    private String prenom;

    @Column(name = "A_FONCTION", length = 50)
    private String fonction;

    // SOLUTION : Ignorer complètement la sérialisation des congés
    // pour éviter les références circulaires
    @OneToMany(mappedBy = "agent", fetch = FetchType.LAZY)
    @JsonIgnore  // <-- Remplace @JsonManagedReference
    private List<Conge> conges;  // Un agent peut avoir plusieurs congés

    // ============ Methode Utilitaire ============
    // Nom et Prenom de l'agent
    public String getFullName(){
        return this.prenom+" "+this.nom;
    }
}