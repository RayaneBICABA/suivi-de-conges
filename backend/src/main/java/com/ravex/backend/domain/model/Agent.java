package com.ravex.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;

// Lombok : @Data = Getters + Setters + toString + equals + hashCode
// @NoArgsConstructor = constructeur vide (JPA l’exige)
// @AllArgsConstructor = constructeur complet
// @Builder = facilite la création d’objets avec un pattern builder


@Entity
@Table(name = "AGENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {
    // =========== Initialisation des Attributs ===========
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

    @Column(name = "A_FONCTION", length = 50)
    private String fonction;

    // =========== Accesseur Personnalisé===========
    public String getFullName(){
        return nom+" "+prenom;
    }
}
